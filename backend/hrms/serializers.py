# from rest_framework import serializers
# from .models import Employee, Attendance


# class EmployeeSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Employee
#         fields = "__all__"


# class AttendanceSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Attendance
#         fields = "__all__"


from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Employee, Attendance


class EmployeeSerializer(serializers.ModelSerializer):
    employee_id = serializers.CharField(read_only=True)  # Make employee_id read-only
    
    class Meta:
        model = Employee
        fields = ["id", "employee_id", "full_name", "email", "department"]
        extra_kwargs = {
            'employee_id': {'read_only': True}
        }

    def validate(self, attrs):
        # DRF + model constraints will already handle duplicates, but you can
        # customize error messages here if you want nicer responses.
        return attrs


class AttendanceSerializer(serializers.ModelSerializer):
    employee_name = serializers.CharField(source="employee.full_name", read_only=True)
    employee_employee_id = serializers.CharField(source="employee.employee_id", read_only=True)

    class Meta:
        model = Attendance
        fields = ["id", "employee", "employee_name", "employee_employee_id", "date", "status", "created_at"]

    def validate(self, attrs):
        # Example: enforce one attendance per employee per date with a clear error
        employee = attrs.get("employee")
        date = attrs.get("date")
        if self.instance is None and Attendance.objects.filter(employee=employee, date=date).exists():
            raise serializers.ValidationError("Attendance for this employee on this date already exists.")
        return attrs


class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8, style={'input_type': 'password'})
    password_confirm = serializers.CharField(write_only=True, min_length=8, style={'input_type': 'password'})
    email = serializers.EmailField(required=True)

    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'password_confirm', 'first_name', 'last_name']
        extra_kwargs = {
            'first_name': {'required': False},
            'last_name': {'required': False},
        }

    def validate(self, attrs):
        if attrs['password'] != attrs['password_confirm']:
            raise serializers.ValidationError({"password": "Password fields didn't match."})
        return attrs

    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("A user with this email already exists.")
        return value

    def validate_username(self, value):
        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError("A user with this username already exists.")
        return value

    def create(self, validated_data):
        validated_data.pop('password_confirm')
        password = validated_data.pop('password')
        user = User.objects.create_user(**validated_data)
        user.set_password(password)
        user.save()
        return user