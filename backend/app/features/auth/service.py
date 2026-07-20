from sqlalchemy.orm import Session

from app.features.auth.models import User
from app.features.auth.schemas import UserSignup
from app.features.auth.security import (
    hash_password,
    verify_password,
    create_access_token,
)


class AuthService:

    def __init__(self, db: Session):

        self.db = db

    def signup(self, user: UserSignup):

        existing_email = self.db.query(User).filter(
            User.email == user.email
        ).first()

        if existing_email:

            raise ValueError("Email already registered.")

        existing_username = self.db.query(User).filter(
            User.username == user.username
        ).first()

        if existing_username:

            raise ValueError("Username already exists.")

        db_user = User(
            username=user.username,
            email=user.email,
            password=hash_password(user.password),
        )

        self.db.add(db_user)
        self.db.commit()
        self.db.refresh(db_user)

        return db_user

    def login(
        self,
        username: str,
        password: str,
    ):

        # username here is actually the user's email
        user = self.db.query(User).filter(
            User.email == username
        ).first()

        if user is None:

            raise ValueError("Invalid credentials.")

        if not verify_password(
            password,
            user.password,
        ):

            raise ValueError("Invalid credentials.")

        token = create_access_token(
            {
                "sub": user.email
            }
        )

        return {
            "access_token": token,
            "token_type": "bearer",
        }

    def change_password(
        self,
        user: User,
        current_password: str,
        new_password: str,
    ):

        if not verify_password(current_password, user.password):
            raise ValueError("Current password is incorrect.")

        user.password = hash_password(new_password)

        self.db.add(user)
        self.db.commit()

        return {"message": "Password updated successfully."}