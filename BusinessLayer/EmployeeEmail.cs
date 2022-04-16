using System.Collections.Generic;
using System.Linq;
using Data = DataLayer;
using Entity = EntityLayer;

namespace BusinessLayer
{
    public class EmployeeEmail
    {
        private readonly Data.EmployeeEmail _db = new Data.EmployeeEmail();

        public bool Create(Entity.EmployeeEmail employeeEmail, out string message)
        {
            if (string.IsNullOrEmpty(employeeEmail.Email) || string.IsNullOrWhiteSpace(employeeEmail.Email))
            {
                message = "El Campo \"Email\" no puede ser vacio.";
                return false;
            }

            return _db.Create(employeeEmail, out message);
        }

        public List<Entity.EmployeeEmail> Read()
        {
            return _db.Read();
        }

        public List<Entity.EmployeeEmail> ReadByCustomer(int employeeId)
        {
            return _db.Read().Where(phone => phone.Employee.Id == employeeId).ToList();
        }

        public bool Update(Entity.EmployeeEmail employeeEmail, out string message)
        {
            if (string.IsNullOrEmpty(employeeEmail.Email) || string.IsNullOrWhiteSpace(employeeEmail.Email))
            {
                message = "El Campo \"Email\" no puede ser vacio.";
                return false;
            }

            return _db.Update(employeeEmail, out message);
        }

        public bool Delete(Entity.EmployeeEmail employeeEmail, out string message)
        {
            return _db.Delete(employeeEmail, out message);
        }
    }
}
