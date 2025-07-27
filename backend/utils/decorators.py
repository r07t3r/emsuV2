
from functools import wraps
from flask import jsonify
from flask_jwt_extended import get_jwt_identity
from ..models.user import User

def role_required(allowed_roles):
    def decorator(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            current_user_id = get_jwt_identity()
            user = User.query.get(current_user_id)
            if not user or user.role not in allowed_roles:
                return jsonify({'message': 'Access denied'}), 403
            return f(*args, **kwargs)
        return decorated_function
    return decorator
