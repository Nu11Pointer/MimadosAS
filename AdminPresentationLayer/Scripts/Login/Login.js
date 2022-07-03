var attempts = 0;

// Evento Document Loaded
document.addEventListener('DOMContentLoaded', function () {
    $("#loginForm").validate({
        rules: {
            Email: {
                required: true,
                email: true
            },
            Password: {
                required: true
            }
        },
        messages: {
            Email: {
                required: "Este campo es obligatorio.",
                email: "Por favor, introduce una dirección de correo electrónico válida."
            },
            Password: {
                required: "Este campo es obligatorio."
            }
        },
        errorClass: "errorText",
        errorElement: "p",
    });
});

function Login() {
    if (!$("#loginForm").valid()) {
        return;
    }

    userObj = {
        "EmployeeEmail": {
            "Email": $("#InputEmail").val()
        },
        "Password": $("#InputPassword").val(),
    };

    jQuery.ajax({
        url: '/User/LogIn',
        type: "POST",
        data: JSON.stringify({ user: userObj }),
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function (response) {
            if (response.result) {
                //window.location.replace("/Home/Index");
                console.log("xd")
                jQuery.ajax({
                    url: '/User/Me',
                    type: "GET",
                    success: function (data) {
                        console.log("xd")
                        user = data;
                        $("#UserName").text(user.Employee.Name + " (" + user.Employee.EmployeePosition.Name + ")")
                        if (user.Employee.EmployeePosition.Name == "Administrador") {
                            window.location.replace("/Home/Index");
                        }  
                        if (user.Employee.EmployeePosition.Name == "Gerente") {
                            window.location.replace("/Employee");
                        }
                        if (user.Employee.EmployeePosition.Name == "Vendedor") {
                            window.location.replace("/Sale");
                        }
                        if (user.Employee.EmployeePosition.Name == "Bodeguero") {
                            window.location.replace("/Purchase");
                        }
                    },
                    error: function (_) {
                    }
                });
            }
            else {
                attempts++;
                if (attempts < 3) {
                    errorAudio.play();
                    swal("¡Acceso Denegado!", "Correo y/o contraseña incorrectos.", "error")
                }
                else {
                    warningAudio.play();
                    swal("¿Haz olvidado tus credenciales?", "Ponte en contacto con el administrador más cercano.", "warning")
                }
            }
        },
        error: function (error) {
            console.log(error);
        },
        beforeSend: function () { }
    });
}

