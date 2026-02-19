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