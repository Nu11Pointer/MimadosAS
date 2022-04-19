using System.Collections.Generic;
using Data = DataLayer;
using Entity = EntityLayer;


namespace BusinessLayer
{
    public class Purchase
    {
        private readonly Data.Purchase _db = new Data.Purchase();

        public bool Create(Entity.Purchase purchase, out string message)
        {
            return _db.Create(purchase, out message);
        }

        public List<Entity.Purchase> Read()
        {
            return _db.Read();
        }

        public bool Update(Entity.Purchase purchase, out string message)
        {
            return _db.Update(purchase, out message);
        }

        public bool Delete(Entity.Purchase purchase, out string message)
        {
            return _db.Delete(purchase, out message);
        }
    }
}
