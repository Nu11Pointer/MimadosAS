using System.Collections.Generic;
using Data = DataLayer;
using Entity = EntityLayer;

namespace BusinessLayer
{
    public class ProductPackaging
    {
        private readonly Data.ProductPackaging _Db = new Data.ProductPackaging();

        public List<Entity.ProductPackaging> Read()
        {
            return _Db.Read();
        }
    }
}
