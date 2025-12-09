from datetime import datetime, timedelta
from typing import Optional
from jose import JWTError, jwt
from passlib.context import CryptContext
from .config import settings

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def truncate_password(password: str, max_bytes: int = 72) -> str:
    password_bytes = password.encode('utf-8')
    
    if len(password_bytes) <= max_bytes:
        return password
    truncated_bytes = password_bytes[:max_bytes]
    
    try:
        return truncated_bytes.decode('utf-8')
    except UnicodeDecodeError:
        for i in range(max_bytes, max_bytes - 4, -1):
            try:
                return password_bytes[:i].decode('utf-8')
            except UnicodeDecodeError:
                continue
        return ""

def verify_password(plain_password: str, hashed_password: str) -> bool:
    truncated = truncate_password(plain_password, max_bytes=72)
    
    try:
        return pwd_context.verify(truncated, hashed_password)
    except Exception as e:
        print(f"❌ Erro ao verificar senha: {e}")
        return False

def get_password_hash(password: str) -> str:
    truncated = truncate_password(password, max_bytes=72)
    
    try:
        return pwd_context.hash(truncated)
    except Exception as e:
        print(f"❌ Erro ao criar hash da senha: {e}")
        raise

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    return encoded_jwt

def verify_token(token: str):
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        return payload
    except JWTError:
        return None