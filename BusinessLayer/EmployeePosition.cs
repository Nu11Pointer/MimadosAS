using System.Collections.Generic;
using Data = DataLayer;
using Entity = EntityLayer;

namespace BusinessLayer
{
    public class EmployeePosition
    {
        private readonly Data.Deparment _Db = new Data.Deparment();

        public bool Create(Entity.Department department, out string message)
        {
            // Validar Nombre
            if (string.IsNullOrEmpty(department.Name) || string.IsNullOrWhiteSpace(department.Name))
            {
                message = "El campo \"Nombre\" no puede ser vacio.";
                return false;
            }

            return _Db.Create(department, out message);
        }

        public List<Entity.Department> Read()
        {
            return _Db.Read();
        }

        public bool Update(Entity.Department department, out string message)
        {
            // Validar Nombre
            if (string.IsNullOrEmpty(department.Name) || string.IsNullOrWhiteSpace(department.Name))
            {
                message = "El campo \"Nombre\" no puede ser vacio.";
                return false;
            }

            return _Db.Update(department, out message);
        }

        public bool Delete(Entity.Department department, out string message)
        {
            return _Db.Delete(department, out message);
        }
    }
}
