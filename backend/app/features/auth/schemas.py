from pydantic import BaseModel, EmailStr


class UserSignup(BaseModel):

    username: str

    email: EmailStr

    password: str


class UserLogin(BaseModel):

    email: EmailStr

    password: str


class Token(BaseModel):

    access_token: str

    token_type: str


class PasswordChange(BaseModel):

    current_password: str

    new_password: str


class UserResponse(BaseModel):

    id: int

    username: str

    email: EmailStr

    class Config:

        from_attributes = True