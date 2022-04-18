using System.Collections.Generic;
using System.Linq;
using Data = DataLayer;
using Entity = EntityLayer;

namespace BusinessLayer
{
    public class SupplierEmail
    {
        private readonly Data.SupplierEmail _db = new Data.SupplierEmail();

        public bool Create(Entity.SupplierEmail supplierEmail, out string message)
        {
            if (string.IsNullOrEmpty(supplierEmail.Email) || string.IsNullOrWhiteSpace(supplierEmail.Email))
            {
                message = "El Campo \"Email\" no puede ser vacio.";
                return false;
            }

            return _db.Create(supplierEmail, out message);
        }

        public List<Entity.SupplierEmail> Read()
        {
            return _db.Read();
        }

        public List<Entity.SupplierEmail> ReadBySupplierId(int supplierId)
        {
            return _db.Read().Where(email => email.Supplier.Id == supplierId).ToList();
        }

        public bool Update(Entity.SupplierEmail supplierEmail, out string message)
        {
            if (string.IsNullOrEmpty(supplierEmail.Email) || string.IsNullOrWhiteSpace(supplierEmail.Email))
            {
                message = "El Campo \"Email\" no puede ser vacio.";
                return false;
            }

            return _db.Update(supplierEmail, out message);
        }

        public bool Delete(Entity.SupplierEmail supplierEmail, out string message)
        {
            return _db.Delete(supplierEmail, out message);
        }
    }
}
