using System.Collections.Generic;
using System.Linq;
using Data = DataLayer;
using Entity = EntityLayer;

namespace BusinessLayer
{
    public class EmployeePhone
    {
        private readonly Data.EmployeePhone _db = new Data.EmployeePhone();

        public bool Create(Entity.EmployeePhone employeePhone, out string message)
        {
            if (string.IsNullOrEmpty(employeePhone.PhoneNumber) || string.IsNullOrWhiteSpace(employeePhone.PhoneNumber))
            {
                message = "El Campo \"Teléfono\" no puede ser vacio.";
                return false;
            }

            if (employeePhone.PhoneNumber.Length != 9)
            {
                message = "El Campo \"Teléfono\" debe contener 9 caracteres.";
                return false;
            }

            return _db.Create(employeePhone, out message);
        }

        public List<Entity.EmployeePhone> Read()
        {
            return _db.Read();
        }

        public List<Entity.EmployeePhone> ReadByCustomer(int employeeId)
        {
            return _db.Read().Where(phone => phone.Employee.Id == employeeId).ToList();
        }

        public bool Update(Entity.EmployeePhone employeePhone, out string message)
        {
            if (string.IsNullOrEmpty(employeePhone.PhoneNumber) || string.IsNullOrWhiteSpace(employeePhone.PhoneNumber))
            {
                message = "El Campo \"Teléfono\" no puede ser vacio.";
                return false;
            }

            if (employeePhone.PhoneNumber.Length != 9)
            {
                message = "El Campo \"Teléfono\" debe contener 9 caracteres.";
                return false;
            }

            return _db.Update(employeePhone, out message);
        }

        public bool Delete(Entity.EmployeePhone employeePhone, out string message)
        {
            return _db.Delete(employeePhone, out message);
        }
    }
}
