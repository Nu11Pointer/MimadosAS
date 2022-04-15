using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Data = DataLayer;
using Entity = EntityLayer;

namespace BusinessLayer
{
    public class CustomerEmail
    {
        private readonly Data.CustomerEmail _db = new Data.CustomerEmail();

        public bool Create(Entity.CustomerEmail customerEmail, out string message)
        {
            if (string.IsNullOrEmpty(customerEmail.Email) || string.IsNullOrWhiteSpace(customerEmail.Email))
            {
                message = "El Campo \"Email\" no puede ser vacio.";
                return false;
            }

            return _db.Create(customerEmail, out message);
        }

        public List<Entity.CustomerEmail> Read()
        {
            return _db.Read();
        }

        public List<Entity.CustomerEmail> ReadByCustomer(int customerId)
        {
            return _db.Read().Where(phone => phone.Customer.Id == customerId).ToList();
        }

        public bool Update(Entity.CustomerEmail customerEmail, out string message)
        {
            if (string.IsNullOrEmpty(customerEmail.Email) || string.IsNullOrWhiteSpace(customerEmail.Email))
            {
                message = "El Campo \"Email\" no puede ser vacio.";
                return false;
            }

            return _db.Update(customerEmail, out message);
        }

        public bool Delete(Entity.CustomerEmail customerEmail, out string message)
        {
            return _db.Delete(customerEmail, out message);
        }
    }
}
