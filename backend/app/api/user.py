from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel, EmailStr
from typing import Optional
from ..core.database import get_db
from ..core.security import verify_password, get_password_hash
from ..models.user import User
from ..models.alert import Alert

router = APIRouter()

class UserUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[EmailStr] = None

class PasswordChange(BaseModel):
    current_password: str
    new_password: str

class UserResponse(BaseModel):
    id: int
    name: str
    email: str
    created_at: str
    
    class Config:
        from_attributes = True

@router.get("/me", response_model=UserResponse)
def get_current_user(user_id: int, db: Session = Depends(get_db)):
    """Retorna informações do usuário atual"""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Usuário não encontrado"
        )
    
    return {
        "id": user.id,
        "name": user.name,
        "email": user.email,
        "created_at": user.created_at.isoformat()
    }

@router.put("/me")
def update_user(
    user_id: int,
    user_update: UserUpdate,
    db: Session = Depends(get_db)
):
    """Atualiza informações do usuário"""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Usuário não encontrado"
        )
    
    # Verifica se email já está em uso por outro usuário
    if user_update.email and user_update.email != user.email:
        existing_email = db.query(User).filter(
            User.email == user_update.email,
            User.id != user_id
        ).first()
        if existing_email:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email já está em uso"
            )
    
    try:
        if user_update.name:
            if len(user_update.name.strip()) < 2:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Nome deve ter pelo menos 2 caracteres"
                )
            user.name = user_update.name.strip()
        
        if user_update.email:
            user.email = user_update.email
        
        db.commit()
        db.refresh(user)
        
        return {
            "message": "Usuário atualizado com sucesso",
            "user": {
                "id": user.id,
                "name": user.name,
                "email": user.email
            }
        }
    
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        print(f"❌ Erro ao atualizar usuário: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Erro ao atualizar usuário"
        )

@router.post("/change-password")
def change_password(
    user_id: int,
    password_data: PasswordChange,
    db: Session = Depends(get_db)
):
    """Altera a senha do usuário"""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Usuário não encontrado"
        )
    
    # Verifica senha atual
    if not verify_password(password_data.current_password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Senha atual incorreta"
        )
    
    # Valida nova senha
    if len(password_data.new_password) < 6:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Nova senha deve ter pelo menos 6 caracteres"
        )
    
    try:
        # Atualiza senha
        user.hashed_password = get_password_hash(password_data.new_password)
        db.commit()
        
        return {"message": "Senha alterada com sucesso"}
    
    except Exception as e:
        db.rollback()
        print(f"❌ Erro ao alterar senha: {e}")
        import traceback
        traceback.print_exc()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Erro ao alterar senha"
        )

@router.delete("/me")
def delete_account(user_id: int, db: Session = Depends(get_db)):
    """Deleta a conta do usuário permanentemente"""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Usuário não encontrado"
        )
    
    try:
        # Deleta todos os alertas do usuário
        db.query(Alert).filter(Alert.user_id == user_id).delete()
        
        # Deleta o usuário
        db.delete(user)
        db.commit()
        
        return {
            "message": "Conta excluída com sucesso",
            "deleted": True
        }
    
    except Exception as e:
        db.rollback()
        print(f"❌ Erro ao deletar conta: {e}")
        import traceback
        traceback.print_exc()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Erro ao deletar conta"
        )