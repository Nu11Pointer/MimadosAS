using System.Collections.Generic;
using Data = DataLayer;
using Entity = EntityLayer;

namespace BusinessLayer
{
    public class EmployeePosition
    {
        private readonly Data.EmployeePosition _Db = new Data.EmployeePosition();

        public bool Create(Entity.EmployeePosition employeePosition, out string message)
        {
            // Validar Nombre
            if (string.IsNullOrEmpty(employeePosition.Name) || string.IsNullOrWhiteSpace(employeePosition.Name))
            {
                message = "El campo \"Nombre\" no puede ser vacio.";
                return false;
            }

            return _Db.Create(employeePosition, out message);
        }

        public List<Entity.EmployeePosition> Read()
        {
            return _Db.Read();
        }

        public bool Update(Entity.EmployeePosition employeePosition, out string message)
        {
            // Validar Nombre
            if (string.IsNullOrEmpty(employeePosition.Name) || string.IsNullOrWhiteSpace(employeePosition.Name))
            {
                message = "El campo \"Nombre\" no puede ser vacio.";
                return false;
            }

            return _Db.Update(employeePosition, out message);
        }

        public bool Delete(Entity.EmployeePosition employeePosition, out string message)
        {
            return _Db.Delete(employeePosition, out message);
        }
    }
}
