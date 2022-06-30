using System;
using System.Collections.Generic;
using Data = DataLayer;
using Entity = EntityLayer;

namespace BusinessLayer
{
    public class Expense
    {
        private readonly Data.Expense _Db = new Data.Expense();

        public List<Entity.Expense> Read()
        {
            var expenses = _Db.Read();
            if (expenses.Count == 0)
            {
                expenses.Add(new Entity.Expense()
                {
                    Month = DateTime.Now.Month,
                    Year = DateTime.Now.Year,
                    SubTotal = 0
                });
            }
            while (expenses.Count < 11)
            {
                expenses.Insert (0, new Entity.Expense()
                {
                    Month = expenses[0].Month - 1 <= 0 ? 12 : expenses[0].Month - 1,
                    Year = expenses[0].Month - 1 <= 0 ? expenses[0].Year - 1 : expenses[0].Year,
                    SubTotal = 0
                });
            }
            return expenses;
        }
    }
}
