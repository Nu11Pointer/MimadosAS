using System.Collections.Generic;
using Data = DataLayer;
using Entity = EntityLayer;

namespace BusinessLayer
{
    public class Supplier
    {
        private readonly Data.Supplier _db = new Data.Supplier();

        public bool Create(Entity.Supplier supplier, out string message)
        {
            // Check Name
            if (string.IsNullOrEmpty(supplier.Name) || string.IsNullOrWhiteSpace(supplier.Name))
            {
                message = "El campo \"Nombre\" no puede ser vacio.";
                return false;
            }

            // Check Address
            if (string.IsNullOrEmpty(supplier.Address) || string.IsNullOrWhiteSpace(supplier.Address))
            {
                message = "El campo \"Dirección\" no puede ser vacio.";
                return false;
            }

            return _db.Create(supplier, out message);
        }

        public List<Entity.Supplier> Read()
        {
            return _db.Read();
        }

        public bool Update(Entity.Supplier supplier, out string message)
        {
            // Check Name
            if (string.IsNullOrEmpty(supplier.Name) || string.IsNullOrWhiteSpace(supplier.Name))
            {
                message = "El campo \"Nombre\" no puede ser vacio.";
                return false;
            }

            // Check Address
            if (string.IsNullOrEmpty(supplier.Address) || string.IsNullOrWhiteSpace(supplier.Address))
            {
                message = "El campo \"Dirección\" no puede ser vacio.";
                return false;
            }

            return _db.Update(supplier, out message);
        }

        public bool Delete(Entity.Supplier supplier, out string message)
        {
            return _db.Delete(supplier, out message);
        }
    }
}
