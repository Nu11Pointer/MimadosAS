using System.Collections.Generic;
using Data = DataLayer;
using Entity = EntityLayer;

namespace BusinessLayer
{
    public class Employee
    {
        private Data.Employee _db = new Data.Employee();

        public bool Create(Entity.Employee employee, out string message)
        {
            // Check IdentityCard
            if (string.IsNullOrEmpty(employee.IdentityCard) || string.IsNullOrWhiteSpace(employee.IdentityCard))
            {
                message = "El campo \"Identificación\" no puede ser vacio.";
                return false;
            }

            // Check Length IdentityCard
            if (employee.IdentityCard.Length != 16)
            {
                message = "El campo \"Identificación\" debe tener 16 caracteres.";
                return false;
            }

            // Check Name
            if (string.IsNullOrEmpty(employee.Name) || string.IsNullOrWhiteSpace(employee.Name))
            {
                message = "El campo \"Nombre\" no puede ser vacio.";
                return false;
            }

            // Check SurName
            if (string.IsNullOrEmpty(employee.SurName) || string.IsNullOrWhiteSpace(employee.SurName))
            {
                message = "El campo \"Apellido\" no puede ser vacio.";
                return false;
            }

            // Check Address
            if (string.IsNullOrEmpty(employee.Address) || string.IsNullOrWhiteSpace(employee.Address))
            {
                message = "El campo \"Dirección\" no puede ser vacio.";
                return false;
            }

            return _db.Create(employee, out message);
        }

        public List<Entity.Employee> Read()
        {
            return _db.Read();
        }

        public bool Update(Entity.Employee employee, out string message)
        {
            // Check IdentityCard
            if (string.IsNullOrEmpty(employee.IdentityCard) || string.IsNullOrWhiteSpace(employee.IdentityCard))
            {
                message = "El campo \"Identificación\" no puede ser vacio.";
                return false;
            }

            // Check Length IdentityCard
            if (employee.IdentityCard.Length != 16)
            {
                message = "El campo \"Identificación\" debe tener 16 caracteres.";
                return false;
            }

            // Check Name
            if (string.IsNullOrEmpty(employee.Name) || string.IsNullOrWhiteSpace(employee.Name))
            {
                message = "El campo \"Nombre\" no puede ser vacio.";
                return false;
            }

            // Check SurName
            if (string.IsNullOrEmpty(employee.SurName) || string.IsNullOrWhiteSpace(employee.SurName))
            {
                message = "El campo \"Apellido\" no puede ser vacio.";
                return false;
            }

            // Check Address
            if (string.IsNullOrEmpty(employee.Address) || string.IsNullOrWhiteSpace(employee.Address))
            {
                message = "El campo \"Dirección\" no puede ser vacio.";
                return false;
            }

            return _db.Update(employee, out message);
        }

        public bool Delete(Entity.Employee employee, out string message)
        {
            return _db.Delete(employee, out message);
        }
    }
}
