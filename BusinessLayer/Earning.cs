using System;
using System.Collections.Generic;
using Data = DataLayer;
using Entity = EntityLayer;

namespace BusinessLayer
{
    public class Earning
    {
        private readonly Data.Earning _Db = new Data.Earning();

        public List<Entity.Earning> Read()
        {
            var earnings = _Db.Read();
            if (earnings.Count == 0)
            {
                earnings.Add(new Entity.Earning()
                {
                    Month = DateTime.Now.Month,
                    Year = DateTime.Now.Year,
                    SubTotal = 0
                });
            }
            while (earnings.Count < 11)
            {
                earnings.Insert(0, new Entity.Earning()
                {
                    Month = earnings[0].Month - 1 <= 0 ? 12 : earnings[0].Month - 1,
                    Year = earnings[0].Month - 1 <= 0 ? earnings[0].Year - 1 : earnings[0].Year,
                    SubTotal = 0
                });
            }
            return earnings;
        }
    }
}
