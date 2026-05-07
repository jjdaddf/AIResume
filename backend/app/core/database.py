"""
MySQL 数据库服务
- 自动建表
- 用户 CRUD
- 简历 CRUD
"""

import pymysql
from pymysql.cursors import DictCursor
from datetime import datetime
from typing import Optional
from app.core.config import settings


def get_connection():
    """获取 MySQL 连接"""
    return pymysql.connect(
        host=settings.MYSQL_HOST,
        port=settings.MYSQL_PORT,
        user=settings.MYSQL_USER,
        password=settings.MYSQL_PASSWORD,
        database=settings.MYSQL_DATABASE,
        charset="utf8mb4",
        cursorclass=DictCursor,
        autocommit=True,
    )


def init_database():
    """初始化数据库：创建数据库（如不存在）+ 建表"""
    # 先连上 MySQL 创建数据库
    conn = pymysql.connect(
        host=settings.MYSQL_HOST,
        port=settings.MYSQL_PORT,
        user=settings.MYSQL_USER,
        password=settings.MYSQL_PASSWORD,
        charset="utf8mb4",
        cursorclass=DictCursor,
        autocommit=True,
    )
    try:
        with conn.cursor() as cur:
            cur.execute(
                f"CREATE DATABASE IF NOT EXISTS `{settings.MYSQL_DATABASE}` "
                "CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci"
            )
    finally:
        conn.close()

    # 建表
    conn = get_connection()
    try:
        with conn.cursor() as cur:
            cur.execute("""
                CREATE TABLE IF NOT EXISTS `users` (
                    `id` INT AUTO_INCREMENT PRIMARY KEY,
                    `username` VARCHAR(50) NOT NULL UNIQUE,
                    `email` VARCHAR(100) DEFAULT NULL,
                    `hashed_password` VARCHAR(255) NOT NULL,
                    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
                    INDEX `idx_username` (`username`)
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
            """)
            cur.execute("""
                CREATE TABLE IF NOT EXISTS `resumes` (
                    `id` VARCHAR(36) PRIMARY KEY,
                    `user_id` INT NOT NULL,
                    `title` VARCHAR(100) NOT NULL DEFAULT '未命名简历',
                    `resume_data` JSON NOT NULL,
                    `theme` VARCHAR(50) DEFAULT 'minimal',
                    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
                    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                    INDEX `idx_user_id` (`user_id`),
                    FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
            """)
    finally:
        conn.close()


# ==================== 用户操作 ====================

def create_user(username: str, email: Optional[str], hashed_password: str) -> dict:
    """创建用户，返回用户记录"""
    conn = get_connection()
    try:
        with conn.cursor() as cur:
            cur.execute(
                "INSERT INTO users (username, email, hashed_password) VALUES (%s, %s, %s)",
                (username, email, hashed_password),
            )
            cur.execute("SELECT id, username, email, created_at FROM users WHERE username = %s", (username,))
            return cur.fetchone()
    finally:
        conn.close()


def get_user_by_username(username: str) -> Optional[dict]:
    """根据用户名查找用户（含密码）"""
    conn = get_connection()
    try:
        with conn.cursor() as cur:
            cur.execute("SELECT * FROM users WHERE username = %s", (username,))
            return cur.fetchone()
    finally:
        conn.close()


def get_user_by_id(user_id: int) -> Optional[dict]:
    """根据 ID 查找用户"""
    conn = get_connection()
    try:
        with conn.cursor() as cur:
            cur.execute("SELECT id, username, email, created_at FROM users WHERE id = %s", (user_id,))
            return cur.fetchone()
    finally:
        conn.close()


# ==================== 简历操作 ====================

def create_resume(resume_id: str, user_id: int, title: str, resume_data: dict, theme: str) -> dict:
    """创建简历"""
    import json
    conn = get_connection()
    try:
        with conn.cursor() as cur:
            cur.execute(
                "INSERT INTO resumes (id, user_id, title, resume_data, theme) VALUES (%s, %s, %s, %s, %s)",
                (resume_id, user_id, title, json.dumps(resume_data, ensure_ascii=False), theme),
            )
            cur.execute("SELECT * FROM resumes WHERE id = %s", (resume_id,))
            return cur.fetchone()
    finally:
        conn.close()


def get_resumes_by_user(user_id: int) -> list:
    """获取用户的所有简历（不含 resume_data）"""
    conn = get_connection()
    try:
        with conn.cursor() as cur:
            cur.execute(
                "SELECT id, user_id, title, theme, created_at, updated_at FROM resumes WHERE user_id = %s ORDER BY updated_at DESC",
                (user_id,),
            )
            return cur.fetchall()
    finally:
        conn.close()


def get_resume_by_id(resume_id: str) -> Optional[dict]:
    """获取单个简历（含 resume_data）"""
    conn = get_connection()
    try:
        with conn.cursor() as cur:
            cur.execute("SELECT * FROM resumes WHERE id = %s", (resume_id,))
            return cur.fetchone()
    finally:
        conn.close()


def update_resume(resume_id: str, title: Optional[str], resume_data: Optional[dict], theme: Optional[str]) -> Optional[dict]:
    """更新简历"""
    import json
    conn = get_connection()
    try:
        with conn.cursor() as cur:
            sets = []
            params = []
            if title is not None:
                sets.append("title = %s")
                params.append(title)
            if resume_data is not None:
                sets.append("resume_data = %s")
                params.append(json.dumps(resume_data, ensure_ascii=False))
            if theme is not None:
                sets.append("theme = %s")
                params.append(theme)
            if not sets:
                cur.execute("SELECT * FROM resumes WHERE id = %s", (resume_id,))
                return cur.fetchone()
            params.append(resume_id)
            cur.execute(f"UPDATE resumes SET {', '.join(sets)} WHERE id = %s", params)
            cur.execute("SELECT * FROM resumes WHERE id = %s", (resume_id,))
            return cur.fetchone()
    finally:
        conn.close()


def delete_resume(resume_id: str) -> bool:
    """删除简历"""
    conn = get_connection()
    try:
        with conn.cursor() as cur:
            cur.execute("DELETE FROM resumes WHERE id = %s", (resume_id,))
            return cur.rowcount > 0
    finally:
        conn.close()
