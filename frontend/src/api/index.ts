import axios from 'axios'

const api = axios.create({
  baseURL: '/api/v1',
  timeout: 120000,
})

// 请求拦截器：自动带 JWT token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  // 非 FormData 请求设置 JSON Content-Type
  if (!(config.data instanceof FormData)) {
    config.headers.set('Content-Type', 'application/json')
  }
  return config
})

// 响应拦截器：401 自动登出
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)

// ==================== AI 接口 ====================

export interface PolishRequest {
  text: string
  section_type: string
}

export interface PolishResponse {
  original_text: string
  polished_text: string
  star_breakdown?: Record<string, string>
  suggestions: string[]
}

export interface JDMatchRequest {
  jd_text: string
  resume_data: any
}

export interface MatchResult {
  skill_name: string
  match_type: string
  relevance_score: number
}

export interface JDMatchResponse {
  overall_score: number
  matched_skills: MatchResult[]
  missing_skills: string[]
  suggestions: string[]
}

export interface SkillRecommendRequest {
  job_title: string
  current_skills: string[]
}

export interface SkillRecommendResponse {
  recommended_skills: Array<{
    name: string
    category: string
    relevance: number
    description: string
  }>
  categories: Record<string, string[]>
}

export interface InterviewRequest {
  resume_data: any
  jd_text?: string
  num_questions: number
}

export interface InterviewQuestion {
  question: string
  category: string
  answer_guide: string
  difficulty: string
}

export interface InterviewResponse {
  questions: InterviewQuestion[]
}

export interface ParseDocxResponse {
  personal_info: {
    name: string
    phone: string
    email: string
    location: string
    website: string
    github: string
    summary: string
  }
  sections: Array<{
    id: string
    type: string
    title: string
    order: number
    visible: boolean
    data: any
  }>
  raw_text: string
}

export const aiApi = {
  polish: (data: PolishRequest) => api.post<PolishResponse>('/ai/polish', data),
  matchJd: (data: JDMatchRequest) => api.post<JDMatchResponse>('/ai/match-jd', data),
  recommendSkills: (data: SkillRecommendRequest) => api.post<SkillRecommendResponse>('/ai/recommend-skills', data),
  generateInterview: (data: InterviewRequest) => api.post<InterviewResponse>('/ai/interview', data),
  parseDocx: (file: File) => {
    const formData = new FormData()
    formData.append('file', file)
    return api.post<ParseDocxResponse>('/ai/parse-docx', formData, {
      timeout: 180000,
    })
  },
}

// ==================== 导出接口 ====================

export interface ExportRequest {
  resume_data: any
  format: 'docx' | 'pdf'
}

export const exportApi = {
  exportResume: (data: ExportRequest) =>
    api.post('/resume/export', data, {
      responseType: 'blob',
    }),
}

// ==================== 通用接口 ====================

export const commonApi = {
  getThemes: () => api.get('/themes'),
  healthCheck: () => api.get('/health'),
}

export default api

// ==================== Auth 接口 ====================

export interface UserOut {
  id: number
  username: string
  email: string | null
  created_at: string | null
}

export interface TokenResponse {
  access_token: string
  token_type: string
  user: UserOut
}

const authApiInstance = axios.create({
  baseURL: '/',
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' },
})

export const authApi = {
  register: (data: { username: string; password: string; email?: string }) =>
    authApiInstance.post<TokenResponse>('/api/auth/register', data),
  login: (data: { username: string; password: string }) =>
    authApiInstance.post<TokenResponse>('/api/auth/login', data),
  me: () => {
    const token = localStorage.getItem('token')
    return authApiInstance.get<UserOut>('/api/auth/me', {
      headers: { Authorization: `Bearer ${token}` },
    })
  },
}

// ==================== Resume CRUD 接口 ====================

export interface ResumeListItem {
  id: string
  title: string
  theme: string
  created_at: string | null
  updated_at: string | null
}

export interface ResumeDetail {
  id: string
  title: string
  theme: string
  resume_data: any
  created_at: string | null
  updated_at: string | null
}

const resumeApiInstance = axios.create({
  baseURL: '/',
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' },
})

resumeApiInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

resumeApiInstance.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)

export const resumeApi = {
  create: (data: { title: string; resume_data: any; theme?: string }) =>
    resumeApiInstance.post<ResumeDetail>('/api/resumes', data),
  list: () => resumeApiInstance.get<ResumeListItem[]>('/api/resumes'),
  get: (id: string) => resumeApiInstance.get<ResumeDetail>(`/api/resumes/${id}`),
  update: (id: string, data: { title?: string; resume_data?: any; theme?: string }) =>
    resumeApiInstance.put<ResumeDetail>(`/api/resumes/${id}`, data),
  delete: (id: string) => resumeApiInstance.delete(`/api/resumes/${id}`),
}
