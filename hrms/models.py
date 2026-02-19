# from django.db import models


# class Employee(models.Model):
#     employee_id = models.CharField(max_length=20, unique=True)
#     full_name = models.CharField(max_length=255)
#     email = models.EmailField(unique=True)
#     department = models.CharField(max_length=100)
#     created_at = models.DateTimeField(auto_now_add=True)

#     def __str__(self):
#         return self.full_name


# class Attendance(models.Model):
#     STATUS_CHOICES = (
#         ("PRESENT", "Present"),
#         ("ABSENT", "Absent"),
#     )

#     employee = models.ForeignKey(
#         Employee,
#         on_delete=models.CASCADE,
#         related_name="attendances"
#     )
#     date = models.DateField()
#     status = models.CharField(max_length=10, choices=STATUS_CHOICES)
#     created_at = models.DateTimeField(auto_now_add=True)

#     class Meta:
#         unique_together = ("employee", "date")

#     def __str__(self):
#         return f"{self.employee.full_name} - {self.date}"
from django.db import models
import re


class Employee(models.Model):
    employee_id = models.CharField(max_length=20, unique=True, blank=True, editable=False)
    full_name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    department = models.CharField(max_length=50)

    def save(self, *args, **kwargs):
        if not self.employee_id:
            # Generate employee_id automatically: EMP0001, EMP0002, etc.
            # Find the highest existing employee number
            max_number = 0
            existing_ids = Employee.objects.exclude(employee_id='').values_list('employee_id', flat=True)
            
            for emp_id in existing_ids:
                # Extract number from employee_id (e.g., "EMP0001" -> 1)
                match = re.search(r'EMP(\d+)', emp_id)
                if match:
                    num = int(match.group(1))
                    max_number = max(max_number, num)
            
            # Generate next employee_id
            next_number = max_number + 1
            self.employee_id = f"EMP{next_number:04d}"
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.employee_id} - {self.full_name}"


class Attendance(models.Model):
    PRESENT = "present"
    ABSENT = "absent"
    STATUS_CHOICES = [
        (PRESENT, "Present"),
        (ABSENT, "Absent"),
    ]

    employee = models.ForeignKey(Employee, related_name="attendance", on_delete=models.CASCADE)
    date = models.DateField()
    status = models.CharField(max_length=10, choices=STATUS_CHOICES)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("employee", "date")  # prevent duplicate records per day

    def __str__(self):
        return f"{self.employee} - {self.date} - {self.status}"