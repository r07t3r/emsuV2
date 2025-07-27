
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from datetime import datetime
from ..models.student import Student
from ..utils.decorators import role_required
from ..app import db

student_bp = Blueprint('students', __name__)

@student_bp.route('', methods=['GET'])
@jwt_required()
@role_required(['admin', 'principal', 'teacher', 'receptionist'])
def get_students():
    try:
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 20, type=int)
        search = request.args.get('search', '')
        grade = request.args.get('grade', '')
        
        query = Student.query.filter_by(is_active=True)
        
        if search:
            query = query.filter(
                (Student.first_name.contains(search)) |
                (Student.last_name.contains(search)) |
                (Student.student_id.contains(search)) |
                (Student.email.contains(search))
            )
        
        if grade:
            query = query.filter_by(grade=grade)
        
        students = query.paginate(page=page, per_page=per_page, error_out=False)
        
        return jsonify({
            'students': [student.to_dict() for student in students.items],
            'total': students.total,
            'pages': students.pages,
            'current_page': students.page
        }), 200
        
    except Exception as e:
        return jsonify({'message': str(e)}), 500

@student_bp.route('', methods=['POST'])
@jwt_required()
@role_required(['admin', 'principal', 'receptionist'])
def create_student():
    try:
        data = request.get_json()
        
        # Check if student ID already exists
        existing_student = Student.query.filter_by(student_id=data['studentId']).first()
        if existing_student:
            return jsonify({'message': 'Student ID already exists'}), 400
        
        # Check if email already exists
        existing_email = Student.query.filter_by(email=data['email']).first()
        if existing_email:
            return jsonify({'message': 'Email already registered'}), 400
        
        student = Student(
            student_id=data['studentId'],
            first_name=data['firstName'],
            last_name=data['lastName'],
            email=data['email'],
            phone=data.get('phone'),
            address=data.get('address'),
            date_of_birth=datetime.strptime(data['dateOfBirth'], '%Y-%m-%d').date() if data.get('dateOfBirth') else None,
            grade=data['grade'],
            guardian_name=data.get('guardianName'),
            guardian_phone=data.get('guardianPhone'),
            guardian_email=data.get('guardianEmail'),
            medical_info=data.get('medicalInfo'),
            emergency_contact=data.get('emergencyContact'),
            transport_mode=data.get('transportMode'),
            blood_group=data.get('bloodGroup')
        )
        
        db.session.add(student)
        db.session.commit()
        
        return jsonify(student.to_dict()), 201
        
    except Exception as e:
        return jsonify({'message': str(e)}), 500

@student_bp.route('/<int:student_id>', methods=['GET'])
@jwt_required()
@role_required(['admin', 'principal', 'teacher', 'receptionist'])
def get_student(student_id):
    try:
        student = Student.query.get(student_id)
        if not student or not student.is_active:
            return jsonify({'message': 'Student not found'}), 404
        
        return jsonify(student.to_dict()), 200
        
    except Exception as e:
        return jsonify({'message': str(e)}), 500

@student_bp.route('/<int:student_id>', methods=['PUT'])
@jwt_required()
@role_required(['admin', 'principal', 'receptionist'])
def update_student(student_id):
    try:
        student = Student.query.get(student_id)
        if not student:
            return jsonify({'message': 'Student not found'}), 404
        
        data = request.get_json()
        
        # Update fields
        for field_map in [
            ('firstName', 'first_name'),
            ('lastName', 'last_name'),
            ('email', 'email'),
            ('phone', 'phone'),
            ('address', 'address'),
            ('grade', 'grade'),
            ('guardianName', 'guardian_name'),
            ('guardianPhone', 'guardian_phone'),
            ('guardianEmail', 'guardian_email'),
            ('medicalInfo', 'medical_info'),
            ('emergencyContact', 'emergency_contact'),
            ('transportMode', 'transport_mode'),
            ('bloodGroup', 'blood_group')
        ]:
            if field_map[0] in data:
                setattr(student, field_map[1], data[field_map[0]])
        
        if 'dateOfBirth' in data and data['dateOfBirth']:
            student.date_of_birth = datetime.strptime(data['dateOfBirth'], '%Y-%m-%d').date()
        
        db.session.commit()
        
        return jsonify(student.to_dict()), 200
        
    except Exception as e:
        return jsonify({'message': str(e)}), 500

@student_bp.route('/<int:student_id>', methods=['DELETE'])
@jwt_required()
@role_required(['admin', 'principal'])
def delete_student(student_id):
    try:
        student = Student.query.get(student_id)
        if not student:
            return jsonify({'message': 'Student not found'}), 404
        
        # Soft delete
        student.is_active = False
        db.session.commit()
        
        return jsonify({'message': 'Student deleted successfully'}), 200
        
    except Exception as e:
        return jsonify({'message': str(e)}), 500
