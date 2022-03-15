using System.Collections.Generic;
using Data = DataLayer;
using Entity = EntityLayer;

namespace BusinessLayer
{
    public class Deparment
    {
        private readonly Data.Deparment _Db = new Data.Deparment();

        public List<Entity.Department> Read()
        {
            return _Db.Read();
        }
    }
}
