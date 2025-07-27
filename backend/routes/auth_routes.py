
from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from datetime import datetime
from ..models.user import User
from ..app import db

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['POST'])
def register():
    try:
        data = request.get_json()
        
        # Check if user already exists
        existing_user = User.query.filter_by(email=data['email']).first()
        if existing_user:
            return jsonify({'message': 'Email already registered'}), 400
        
        # Create new user
        user = User(
            email=data['email'],
            first_name=data['firstName'],
            last_name=data['lastName'],
            role=data['role'],
            phone=data.get('phone')
        )
        user.set_password(data['password'])
        
        db.session.add(user)
        db.session.commit()
        
        # Generate token
        access_token = create_access_token(identity=user.id)
        
        return jsonify({
            'user': user.to_dict(),
            'token': access_token
        }), 201
        
    except Exception as e:
        return jsonify({'message': str(e)}), 500

@auth_bp.route('/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        
        user = User.query.filter_by(email=data['email']).first()
        
        if user and user.check_password(data['password']) and user.is_active:
            # Update last login
            user.last_login = datetime.utcnow()
            db.session.commit()
            
            access_token = create_access_token(identity=user.id)
            return jsonify({
                'user': user.to_dict(),
                'token': access_token
            }), 200
        
        return jsonify({'message': 'Invalid credentials'}), 401
        
    except Exception as e:
        return jsonify({'message': str(e)}), 500

@auth_bp.route('/me', methods=['GET'])
@jwt_required()
def get_current_user():
    try:
        current_user_id = get_jwt_identity()
        user = User.query.get(current_user_id)
        
        if user and user.is_active:
            return jsonify(user.to_dict()), 200
        
        return jsonify({'message': 'User not found'}), 404
        
    except Exception as e:
        return jsonify({'message': str(e)}), 500

@auth_bp.route('/profile', methods=['PUT'])
@jwt_required()
def update_profile():
    try:
        current_user_id = get_jwt_identity()
        user = User.query.get(current_user_id)
        
        if not user:
            return jsonify({'message': 'User not found'}), 404
        
        data = request.get_json()
        
        # Update allowed fields
        if 'firstName' in data:
            user.first_name = data['firstName']
        if 'lastName' in data:
            user.last_name = data['lastName']
        if 'phone' in data:
            user.phone = data['phone']
        if 'profilePicture' in data:
            user.profile_picture = data['profilePicture']
        
        db.session.commit()
        
        return jsonify(user.to_dict()), 200
        
    except Exception as e:
        return jsonify({'message': str(e)}), 500
