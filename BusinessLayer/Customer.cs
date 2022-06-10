using System.Collections.Generic;
using System.Linq;
using Data = DataLayer;
using Entity = EntityLayer;

namespace BusinessLayer
{
    public class Customer
    {
        private Data.Customer _db = new Data.Customer();

        public bool Create(Entity.Customer customer, out string message)
        {
            // Check Name
            if (string.IsNullOrEmpty(customer.Name) || string.IsNullOrWhiteSpace(customer.Name))
            {
                message = "El campo \"Nombre\" no puede ser vacio.";
                return false;
            }

            // Check SurName
            if (string.IsNullOrEmpty(customer.SurName) || string.IsNullOrWhiteSpace(customer.SurName))
            {
                message = "El campo \"Apellido\" no puede ser vacio.";
                return false;
            }

            customer.IdentityCard = customer.IdentityCard is null ? "" : customer.IdentityCard;
            customer.Address = customer.Address is null ? "" : customer.Address;

            return _db.Create(customer, out message);
        }

        public List<Entity.Customer> Read()
        {
            return _db.Read();
        }

        public Entity.Customer ReadById(int id)
        {
            return _db.Read().FirstOrDefault(c => c.Id == id);
        }

        public bool Update(Entity.Customer customer, out string message)
        {
            // Check Name
            if (string.IsNullOrEmpty(customer.Name) || string.IsNullOrWhiteSpace(customer.Name))
            {
                message = "El campo \"Nombre\" no puede ser vacio.";
                return false;
            }

            // Check SurName
            if (string.IsNullOrEmpty(customer.SurName) || string.IsNullOrWhiteSpace(customer.SurName))
            {
                message = "El campo \"Apellido\" no puede ser vacio.";
                return false;
            }

            customer.IdentityCard = customer.IdentityCard is null ? "" : customer.IdentityCard;
            customer.Address = customer.Address is null ? "" : customer.Address;

            return _db.Update(customer, out message);
        }

        public bool Delete(Entity.Customer customer, out string message)
        {
            return _db.Delete(customer, out message);
        }
    }
}
