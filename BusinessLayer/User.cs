using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Net;
using System.Net.Mail;
using Data = DataLayer;
using Entity = EntityLayer;

namespace BusinessLayer
{
    public class User
    {
        private readonly Data.User _db = new Data.User();

        public bool Create(Entity.User user, out string message)
        {
            user.Password = password();
            var result = _db.Create(user, out message);

            // Si el usuario no se creo
            if (!result)
            {
                return result;
            }

            var subject = "Creación de cuenta";
            var body = user.Password;
            bool email = SendEmail(user.EmployeeEmail.Email, subject, body);

            // No se envió el correo
            if (!email)
            {
                message = "Creamos el usuario pero no pudimos enviar el correo al destino.";
                return email;
            }

            return result;
        }

        public List<Entity.User> Read()
        {
            return _db.Read();
        }

        public Entity.User ReadById(int EmployeeId)
        {
            return _db.Read().FirstOrDefault(e => e.Employee.Id == EmployeeId);
        }

        public Entity.User ReadByEmail(string EmployeeEmail)
        {
            return _db.Read().FirstOrDefault(e => e.EmployeeEmail.Email == EmployeeEmail);
        }

        public bool Update(Entity.User user, out string message)
        {
            return _db.Update(user, out message);
        }

        public bool Delete(Entity.User user, out string message)
        {
            return _db.Delete(user, out message);
        }

        public bool Verification(Entity.User user, out string message)
        {
            return _db.Verification(user, out message);
        }

        public bool ChangePassword(Entity.User user, out string message)
        {
            return _db.ChangePassword(user, out message);
        }

        public bool ResendPassword(Entity.User user, out string message)
        {
            user.Password = password();
            var subject = "Creación de cuenta";
            var body = user.Password;
            ChangePassword(user, out message);
            bool email = SendEmail(user.EmployeeEmail.Email, subject, body);
            message = email ? "" : "No pudimos enviar el correo al destino.";
            return email;
        }

        private string password()
        {
            string password = Guid.NewGuid().ToString("N").Substring(0, 8);
            return password;
        }

        private bool SendEmail(string email, string subject, string body)
        {
            bool result;
            try
            {

                var mail = new MailMessage(ConfigurationManager.AppSettings["SMTP_USER"], email)
                {
                    Subject = subject,
                    Body = EmailTemplate.PasswordTemplate(body),
                    IsBodyHtml = true
                };

                var smtp = new SmtpClient()
                {
                    Credentials = new NetworkCredential(ConfigurationManager.AppSettings["SMTP_USER"], ConfigurationManager.AppSettings["SMTP_PASSWORD"]),
                    Host = ConfigurationManager.AppSettings["SMTP_SERVER"],
                    Port = 587,
                    EnableSsl = true
                };

                smtp.Send(mail);
                result = true;

            }
            catch
            {
                result = false;
            }

            return result;
        }
    }
}
