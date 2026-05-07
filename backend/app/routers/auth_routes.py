"""
认证路由：注册 / 登录 / 当前用户
"""

import hashlib
from fastapi import APIRouter, HTTPException, status, Depends
from app.models.auth import UserRegister, UserLogin, UserOut, TokenResponse
from app.core.database import create_user, get_user_by_username
from app.core.auth import create_access_token, get_current_user

router = APIRouter(prefix="/api/auth", tags=["认证"])


def hash_password(password: str) -> str:
    """SHA-256 哈希密码"""
    return hashlib.sha256(password.encode("utf-8")).hexdigest()


@router.post("/register", response_model=TokenResponse)
def register(body: UserRegister):
    """用户注册"""
    existing = get_user_by_username(body.username)
    if existing:
        raise HTTPException(status_code=400, detail="用户名已存在")
    hashed = hash_password(body.password)
    user = create_user(body.username, body.email, hashed)
    token = create_access_token(user["id"], user["username"])
    return TokenResponse(
        access_token=token,
        user=UserOut(**{k: str(v) if k == "created_at" else v for k, v in user.items()}),
    )


@router.post("/login", response_model=TokenResponse)
def login(body: UserLogin):
    """用户登录"""
    user = get_user_by_username(body.username)
    if not user or user["hashed_password"] != hash_password(body.password):
        raise HTTPException(status_code=401, detail="用户名或密码错误")
    token = create_access_token(user["id"], user["username"])
    return TokenResponse(
        access_token=token,
        user=UserOut(
            id=user["id"],
            username=user["username"],
            email=user.get("email"),
            created_at=str(user.get("created_at", "")),
        ),
    )


@router.get("/me", response_model=UserOut)
def me(user: dict = Depends(get_current_user)):
    """获取当前用户信息"""
    return UserOut(
        id=user["id"],
        username=user["username"],
        email=user.get("email"),
        created_at=str(user.get("created_at", "")),
    )
