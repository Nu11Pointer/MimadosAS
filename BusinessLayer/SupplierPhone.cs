using System.Collections.Generic;
using System.Linq;
using Data = DataLayer;
using Entity = EntityLayer;

namespace BusinessLayer
{
    public class SupplierPhone
    {
        private readonly Data.SupplierPhone _db = new Data.SupplierPhone();

        public bool Create(Entity.SupplierPhone supplierPhone, out string message)
        {
            if (string.IsNullOrEmpty(supplierPhone.PhoneNumber) || string.IsNullOrWhiteSpace(supplierPhone.PhoneNumber))
            {
                message = "El Campo \"Teléfono\" no puede ser vacio.";
                return false;
            }

            if (supplierPhone.PhoneNumber.Length != 9)
            {
                message = "El Campo \"Teléfono\" debe contener 9 caracteres.";
                return false;
            }

            return _db.Create(supplierPhone, out message);
        }

        public List<Entity.SupplierPhone> Read()
        {
            return _db.Read();
        }

        public List<Entity.SupplierPhone> ReadBySupplierId(int supplierId)
        {
            return _db.Read().Where(phone => phone.Supplier.Id == supplierId).ToList();
        }

        public bool Update(Entity.SupplierPhone supplierPhone, out string message)
        {
            if (string.IsNullOrEmpty(supplierPhone.PhoneNumber) || string.IsNullOrWhiteSpace(supplierPhone.PhoneNumber))
            {
                message = "El Campo \"Teléfono\" no puede ser vacio.";
                return false;
            }

            if (supplierPhone.PhoneNumber.Length != 9)
            {
                message = "El Campo \"Teléfono\" debe contener 9 caracteres.";
                return false;
            }

            return _db.Update(supplierPhone, out message);
        }

        public bool Delete(Entity.SupplierPhone supplierPhone, out string message)
        {
            return _db.Delete(supplierPhone, out message);
        }
    }
}
