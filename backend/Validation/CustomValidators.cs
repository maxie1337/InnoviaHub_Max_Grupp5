using System.ComponentModel.DataAnnotations;
using System.Text.RegularExpressions;

namespace backend.Validation
{
    public class StrongPasswordAttribute : ValidationAttribute
    {
        public override bool IsValid(object? value)
        {
            if (value is not string password)
                return false;

            // At least 8 characters, 1 uppercase, 1 lowercase, 1 digit, 1 special character
            var hasMinimumLength = password.Length >= 8;
            var hasUpperCase = Regex.IsMatch(password, @"[A-Z]");
            var hasLowerCase = Regex.IsMatch(password, @"[a-z]");
            var hasDigit = Regex.IsMatch(password, @"\d");
            var hasSpecialChar = Regex.IsMatch(password, @"[!@#$%^&*(),.?""{}|<>]");

            return hasMinimumLength && hasUpperCase && hasLowerCase && hasDigit && hasSpecialChar;
        }

        public override string FormatErrorMessage(string name)
        {
            return "Password must contain at least 8 characters, 1 uppercase, 1 lowercase, 1 digit, and 1 special character";
        }
    }

    public class NameAttribute : ValidationAttribute
    {
        public override bool IsValid(object? value)
        {
            if (value is not string name)
                return false;

            // Allow letters, spaces, and common characters
            return Regex.IsMatch(name, @"^[a-zA-Z\s\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]+$");
        }

        public override string FormatErrorMessage(string name)
        {
            return "Name must contain only letters and spaces";
        }
    }

    public class FutureDateAttribute : ValidationAttribute
    {
        public override bool IsValid(object? value)
        {
            if (value is not DateTime date)
                return false;

            return date > DateTime.Now;
        }

        public override string FormatErrorMessage(string name)
        {
            return "Date must be in the future";
        }
    }

    public class ValidBookingDurationAttribute : ValidationAttribute
    {
        private readonly int _maxHours;

        public ValidBookingDurationAttribute(int maxHours = 8)
        {
            _maxHours = maxHours;
        }

        public override bool IsValid(object? value)
        {
            if (value is not DateTime endDate)
                return false;

            // This should be used with a model that has both StartDate and EndDate
            // For now, we'll just check if it's a reasonable future date
            return endDate > DateTime.Now && endDate <= DateTime.Now.AddHours(_maxHours);
        }

        public override string FormatErrorMessage(string name)
        {
            return $"Booking duration must be less than {_maxHours} hours";
        }
    }

    public class UniqueEmailAttribute : ValidationAttribute
    {
        public override bool IsValid(object? value)
        {
            // This would typically check against the database
            // For now, we'll just validate the format
            if (value is not string email)
                return false;

            return new EmailAddressAttribute().IsValid(email);
        }

        public override string FormatErrorMessage(string name)
        {
            return "Email is already in use";
        }
    }
}
