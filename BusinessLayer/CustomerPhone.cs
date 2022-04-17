using System.Collections.Generic;
using System.Linq;
using Data = DataLayer;
using Entity = EntityLayer;

namespace BusinessLayer
{
    public class CustomerPhone
    {
        private Data.CustomerPhone _db = new Data.CustomerPhone();

        public bool Create(Entity.CustomerPhone customerPhone, out string message)
        {
            if (string.IsNullOrEmpty(customerPhone.PhoneNumber) || string.IsNullOrWhiteSpace(customerPhone.PhoneNumber))
            {
                message = "El Campo \"Teléfono\" no puede ser vacio.";
                return false;
            }

            if (customerPhone.PhoneNumber.Length != 9)
            {
                message = "El Campo \"Teléfono\" debe contener 9 caracteres.";
                return false;
            }

            return _db.Create(customerPhone, out message);
        }

        public List<Entity.CustomerPhone> Read()
        {
            return _db.Read();
        }

        public List<Entity.CustomerPhone> ReadByCustomer(int customerId)
        {
            return _db.Read().Where(phone => phone.Customer.Id == customerId).ToList();
        }

        public bool Update(Entity.CustomerPhone customerPhone, out string message)
        {
            if (string.IsNullOrEmpty(customerPhone.PhoneNumber) || string.IsNullOrWhiteSpace(customerPhone.PhoneNumber))
            {
                message = "El Campo \"Teléfono\" no puede ser vacio.";
                return false;
            }

            if (customerPhone.PhoneNumber.Length != 9)
            {
                message = "El Campo \"Teléfono\" debe contener 9 caracteres.";
                return false;
            }

            return _db.Update(customerPhone, out message);
        }

        public bool Delete(Entity.CustomerPhone customerPhone, out string message)
        {
            return _db.Delete(customerPhone, out message);
        }
    }
}
