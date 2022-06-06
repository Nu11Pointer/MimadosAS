var customerTable;
var customerObj;
var rowSelected;
var phoneObj;
var phoneTable
var emailObj;
var emailTable;
var CreateForm;
var UpdateForm;
var CreatePhoneForm;
var UpdatePhoneForm;
var CreateEmailForm;
var UpdateEmailForm;

function SetUp() {

    $('#nav-Customer').addClass('active');

    // Show DataTable
    Read();
    DeparmentLoad();

    // Validaciones
    jQuery.validator.addMethod("identification", function (value, element) {
        var date = moment(value.substring(4, 10), "DDMMYY");
        return this.optional(element) || /^((00[1-9])|(04[1-8])|(08[1-9])|(09[0-3])|(12[1-9])|(130)|(16[1-6])|(20[1-4])|(24[1-7])|(28[1-9])|(29[0-1])|(32[1-9])|(36[1-6])|(40[1-9])|(44[1-9])|(45[0-3])|(48[1-9])|(49[0-3])|(52[1-6])|(56[1-9])|(570)|(601)|(60[3-6])|(616)|(619)|(624)|(62[6-8])|(607)|(608)|(61[0-2])|(615)|(454)|(602))-((?!00)\d{2}){3}-(?!0000).{4}[A-Z]$/i.test(value) && date.isValid();
    }, "Ingrese una cédula válida.");

    jQuery.validator.addMethod("phoneNumber", function (value, element) {
        return this.optional(element) || /^[0-9]{4}-[0-9]{4}$/i.test(value);
    }, "Ingrese un teléfono válido.");

    jQuery.validator.addMethod("email", function (value, element) {
        return this.optional(element) || /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i.test(value);
    }, "Ingrese un correo válido.");
    Validator();
    ValidatorPhone();
    ValidatorEmail()

    $("#dataTable tbody").on("click", '.btn-update', ShowUpdateModal);
    $("#dataTable tbody").on("click", '.btn-detelete', Delete);

    // Phone
    $("#dataTable tbody").on("click", '.btn-phone', ShowPhoneRead);
    $("#dataTablePhone tbody").on("click", '.btn-update', ShowPhoneUpdate);
    $("#dataTablePhone tbody").on("click", '.btn-detelete', DeletePhone);

    // Email
    $("#dataTable tbody").on("click", '.btn-email', ShowEmailRead);
    $("#dataTableEmail tbody").on("click", '.btn-update', ShowEmailUpdate);
    $("#dataTableEmail tbody").on("click", '.btn-detelete', DeleteEmail);
}

function ShowCreateModal() {
    $("#IdentitityCardCreate").val("");
    $("#NameCreate").val("");
    $("#SurNameCreate").val("");
    $("#ActiveCreate").val(1);
    $("#DepartmentCreate").val($("#DepartmentCreate option:first").val());
    $("#MunicipalityCreate").val($("#MunicipalityCreate option:first").val());
    $("#AddressCreate").val("");
    $("#FormModalCreate").modal("show");
    $("#ErrorCreate").hide();
    CreateForm.resetForm();
}

function DeparmentLoad() {
    // Load Selector Department
    jQuery.ajax({
        url: '/Deparment/Read',
        type: "GET",
        data: null,
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function (data) {
            $.each(data.data, function (_index, value) {
                $("<option>").attr({ "value": value.Id }).text(value.Name).appendTo("#DepartmentCreate");
                $("<option>").attr({ "value": value.Id }).text(value.Name).appendTo("#DepartmentUpdate");
            })
        },
        error: function (error) {
            console.log(error);
        }
    }).done(MunicipalityOnChange);
}

function MunicipalityOnChange() {

    $("#MunicipalityCreate option").remove();
    $("#MunicipalityUpdate option").remove();

    // Load Selector Municipality
    jQuery.ajax({
        url: '/Municipality/ReadByDepartment',
        type: "POST",
        data: JSON.stringify({ deparmentId: $("#DepartmentCreate option:selected").val() }),
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function (data) {
            $.each(data.data, function (_index, value) {
                $("<option>").attr({ "value": value.Id }).text(value.Name).appendTo("#MunicipalityCreate");
            })
        },
        error: function (error) {
            console.log(error);
        }
    });
    jQuery.ajax({
        url: '/Municipality/ReadByDepartment',
        type: "POST",
        data: JSON.stringify({ deparmentId: $("#DepartmentUpdate option:selected").val() }),
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function (data) {
            $.each(data.data, function (_index, value) {
                $("<option>").attr({ "value": value.Id }).text(value.Name).appendTo("#MunicipalityUpdate");
                try {
                    if (customerObj.Municipality.Id != -1) {
                        $("#MunicipalityUpdate").val(customerObj.Municipality.Id);
                        customerObj.Municipality.Id = -1;
                    }
                } catch (e) { }
            })
        },
        error: function (error) {
            console.log(error);
        }
    });
}

function Validator() {
    CreateForm = $("#CreateForm").validate({
        rules: {
            IdentitityCardCreate: {
                identification: true
            },
            NameCreate: {
                required: true
            },
            SurNameCreate: {
                required: true
            },
            AddressCreate: {
                required: true
            }
        },
        messages: {
            NameCreate: {
                required: "Este campo es obligatorio."
            },
            SurNameCreate: {
                required: "Este campo es obligatorio."
            },
            AddressCreate: {
                required: "Este campo es obligatorio."
            }
        },
        errorClass: "errorTextForm",
        errorElement: "p"
    });

    UpdateForm = $("#UpdateForm").validate({
        rules: {
            IdentitityCardUpdate: {
                identification: true
            },
            NameUpdate: {
                required: true
            },
            AddressUpdate: {
                required: true
            }
        },
        messages: {
            NameUpdate: {
                required: "Este campo es obligatorio."
            },
            SurNameCreate: {
                required: "Este campo es obligatorio."
            },
            AddressUpdate: {
                required: "Este campo es obligatorio."
            }
        },
        errorClass: "errorTextForm",
        errorElement: "p"
    });
}

function ShowUpdateModal() {

    rowSelected = $(this).closest("tr");
    if ($(rowSelected).hasClass('child')) {
        rowSelected = $(rowSelected).prev();
    }

    customerObj = customerTable.row(rowSelected).data();

    $("#IdentitityCardUpdate").val(customerObj.IdentityCard);
    $("#NameUpdate").val(customerObj.Name);
    $("#SurNameUpdate").val(customerObj.SurName);
    $("#ActiveUpdate").val(customerObj.Active ? 1 : 0);
    $("#DepartmentUpdate").val(customerObj.Municipality.Department.Id);
    $("#DepartmentUpdate").trigger("change");
    $("#AddressUpdate").val(customerObj.Address);
    $("#FormModalUpdate").modal("show");
    $("#ErrorUpdate").hide();
    UpdateForm.resetForm();
}

function Read() {
    customerTable = $('#dataTable').DataTable({
        responsive: true,
        ordering: true,
        "ajax": {
            url: '/Customer/ReadCustomers',
            type: "GET",
            dataType: "json"
        },
        "columns": [
            { "data": "Id" },
            //{ "data": "IdentityCard" },
            { "data": "Name" },
            { "data": "SurName" },
            { "data": "Municipality.Department.Name" },
            { "data": "Municipality.Name" },
            {
                "data": "Active", "render": function (value) {
                    if (value)
                        return '<h5><span class="badge badge-success">Habilitado</span></h5>';
                    else
                        return '<h5><span class="badge badge-danger">Deshabilitado</span></h5>';
                }
            },
            {
                "defaultContent": '<button type="button" class="btn btn-primary btn-circle btn-sm btn-update mr-1 mb-1 data-toggle="tooltip" title="Editar cliente""><i class="fas fa-pen"></i></button>' +
                    '<button type="button" class="btn btn-danger btn-circle btn-sm ms-2 btn-detelete mr-1 mb-1 data-toggle="tooltip" title="Eliminar cliente""><i class="fas fa-trash"></i></button>' +
                    '<button type="button" class="btn btn-success btn-circle btn-sm btn-phone mr-1 mb-1 data-toggle="tooltip" title="Ver teléfonos""><i class="fas fa-phone-alt"></i></button>' +
                    '<button type="button" class="btn btn-info btn-circle btn-sm btn-email mr-1 mb-1 data-toggle="tooltip" title="Ver correos""><i class="fas fa-envelope"></i></button>',
                "orderable": false,
                "searchable": false
            }
        ],
        "language": {
            "url": "https://cdn.datatables.net/plug-ins/1.11.4/i18n/es_es.json"
        }
    });
}

function Create() {

    if (!$("#CreateForm").valid()) {
        return;
    }

    customerObj = {
        "IdentityCard": $("#IdentitityCardCreate").val(),
        "Name": $("#NameCreate").val(),
        "SurName": $("#SurNameCreate").val(),
        "Address": $("#AddressCreate").val(),
        "Municipality": {
            "Id": $("#MunicipalityCreate option:selected").val()
        },
        "Active": $("#ActiveCreate option:selected").val() == 1 ? true : false
    };

    jQuery.ajax({
        url: '/Customer/CreateCustomer',
        type: "POST",
        data: JSON.stringify({ customer: customerObj }),
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function (response) {
            // Ocultar Carga y Modal
            $(".modal-body").LoadingOverlay("hide");
            $("#FormModalCreate").modal("hide");

            // Si se creo entonces notificar
            if (response.result) {
                successAudio.play();
                swal({
                    title: "¡Buen trabajo!",
                    text: "¡Has creado un nuevo cliente!",
                    type: "success",
                    confirmButtonClass: "btn-success",
                    confirmButtonText: "Aceptar",
                    closeOnConfirm: true
                },
                    function () {
                        customerTable.ajax.reload();
                    });
            }
            // Sino entonces notificar
            else {
                var text = response.message;
                if (response.message.includes("Referencia a objeto no establecida como instancia de un objeto.")) {
                    text = "No se proporcionó uno de los campos del formulario.";
                }
                if (response.message.includes("'UQ__Customer__DA5B2F6D810D38F3'")) {
                    text = "La cédula ingresada ya ha sido registrada.";
                }
                errorAudio.play();
                swal({
                    title: "¡Algo salió mal!",
                    text: text,
                    type: "error",
                    confirmButtonClass: "btn-danger",
                    confirmButtonText: "Aceptar",
                    closeOnConfirm: true
                },
                    function () {
                        $("#FormModalCreate").modal("show");
                    }
                );
            }
        },
        error: function (error) {
            $(".modal-body").LoadingOverlay("hide");
            $("#ErrorCreate").text(error.responseText);
            $("#ErrorCreate").show();
        },
        beforeSend: function () {

            $(".modal-body").LoadingOverlay("show", {
                imageResizeFactor: 2,
                text: "Cargando...",
                size: 14
            });
        }
    });
}

function Update() {

    if (!$("#UpdateForm").valid()) {
        return;
    }

    customerObj = {
        "Id": customerObj.Id,
        "IdentityCard": $("#IdentitityCardUpdate").val(),
        "Name": $("#NameUpdate").val(),
        "SurName": $("#SurNameUpdate").val(),
        "Address": $("#AddressUpdate").val(),
        "Municipality": {
            "Id": $("#MunicipalityUpdate option:selected").val()
        },
        "Active": $("#ActiveUpdate option:selected").val() == 1 ? true : false
    };

    jQuery.ajax({
        url: '/Customer/UpdateCustomer',
        type: "POST",
        data: JSON.stringify({ customer: customerObj }),
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function (response) {
            // Ocultar Carga y Modal
            $(".modal-body").LoadingOverlay("hide");
            $("#FormModalUpdate").modal("hide");

            // Si se creo entonces notificar
            if (response.result) {
                successAudio.play();
                swal({
                    title: "¡Buen trabajo!",
                    text: "¡Has actualizado el cliente!",
                    type: "success",
                    confirmButtonClass: "btn-success",
                    confirmButtonText: "Aceptar",
                    closeOnConfirm: true
                },
                    function () {
                        customerTable.ajax.reload();
                    });
            }
            // Sino entonces notificar
            else {
                var text = response.message;
                if (response.message.includes("'UQ__Customer__DA5B2F6D810D38F3'")) {
                    text = "La cédula ingresada ya ha sido registrada.";
                }
                errorAudio.play();
                swal({
                    title: "¡Algo salió mal!",
                    text: text,
                    type: "error",
                    confirmButtonClass: "btn-danger",
                    confirmButtonText: "Aceptar",
                    closeOnConfirm: true
                },
                    function () {
                        $("#FormModalUpdate").modal("show");
                    }
                );
            }
        },
        error: function (error) {

            $(".modal-body").LoadingOverlay("hide");
            $("#ErrorUpdate").text(error.responseText);
            $("#ErrorUpdate").show();
        },
        beforeSend: function () {

            $(".modal-body").LoadingOverlay("show", {
                imageResizeFactor: 2,
                text: "Cargando...",
                size: 14
            });
        }
    });
}

function Delete() {
    rowSelected = $(this).closest("tr");
    if ($(rowSelected).hasClass('child')) {
        rowSelected = $(rowSelected).prev();
    }

    customerObj = customerTable.row(rowSelected).data();

    if (!customerObj.Active) {
        warningAudio.play();
        swal("Información", "El cliente se encuentra deshabilitado, no puede realizar esta acción.", "info");
        return;
    }

    warningAudio.play();
    // Preguntar antes de eliminar
    swal({
        title: "Eliminar Cliente",
        text: "¡No podrás recuperar este cliente!",
        type: "warning",
        showCancelButton: true,
        confirmButtonClass: "btn-danger",
        confirmButtonText: "¡Sí, bórralo!",
        cancelButtonText: "¡No, cancela por favor!",
        closeOnConfirm: false,
        closeOnCancel: false
    },
        function (isConfirm) {
            // Si el usuario confirma entonces eliminarlo
            if (isConfirm) {
                jQuery.ajax({
                    url: '/Customer/DeleteCustomer',
                    type: "POST",
                    data: JSON.stringify({ customer: customerObj }),
                    dataType: "json",
                    contentType: "application/json; charset=utf-8",
                    success: function (response) {
                        // Si se eliminó entonces notificar y actualizar tabla
                        if (response.result) {
                            successAudio.play();
                            swal({
                                title: "¡Eliminado!",
                                text: "El cliente ha sido eliminado.",
                                type: "success",
                                confirmButtonClass: "btn-success",
                                confirmButtonText: "Aceptar",
                                closeOnConfirm: true
                            },
                                function () {
                                    customerTable.ajax.reload();
                                }
                            );
                        }
                        // Sino Entonces Notificar Error
                        else {
                            var text = response.message;
                            if (response.message.includes("\"FK__Sale__CustomerId__02FC7413\"")) {
                                text = "El cliente que tratas de eliminar está siendo utilizado los registros de compras.";
                            }
                            if (response.message.includes("\"FK__CustomerE__Custo__398D8EEE\"")) {
                                text = "El cliente que tratas de eliminar está siendo utilizado.";
                            }
                            errorAudio.play();
                            swal({
                                title: "¡Algo salió mal!",
                                text: text,
                                type: "error",
                                confirmButtonClass: "btn-danger",
                                confirmButtonText: "Aceptar",
                                closeOnConfirm: true
                            });
                        }
                    },
                    error: function (error) {
                        console.log(error);
                    },
                    beforeSend: function () { }
                });
            }
            // Sino entonces notificar la cancelación
            else {
                swal("Cancelado", "Su cliente está intacto.", "info");
            }
        }
    );
}

function ShowPhoneRead() {
    $("#FormModalPhone").modal("show");

    var rowSelected = $(this).closest("tr");
    if ($(rowSelected).hasClass('child')) {
        rowSelected = $(rowSelected).prev();
    }

    customerObj = customerTable.row(rowSelected).data();

    if (phoneTable != null) {
        phoneTable.destroy();
    }

    phoneTable = $('#dataTablePhone').DataTable({
        responsive: true,
        ordering: true,
        "ajax": {
            url: '/Customer/ReadCustomerPhonesByCustomerId',
            type: "POST",
            data: { customerId: customerObj.Id }
        },
        "columns": [
            { "data": "Id" },
            { "data": "PhoneNumber" },
            {
                "data": "Active", "render": function (value) {
                    if (value)
                        return '<h4><span class="badge badge-success">Habilitado</span></h4>';
                    else
                        return '<h4><span class="badge badge-danger">Deshabilitado</span></h4>';
                }
            },
            {
                "defaultContent": '<button type="button" class="btn btn-primary btn-circle btn-sm btn-update mr-1 mb-1 data-toggle="tooltip" title="Editar teléfono""><i class="fas fa-pen"></i></button>' +
                    '<button type="button" class="btn btn-danger btn-circle btn-sm ms-2 btn-detelete mr-1 mb-1 data-toggle="tooltip" title="Eliminar teléfono""><i class="fas fa-trash"></i></button>',
                "orderable": false,
                "searchable": false
            }
        ],
        "language": {
            "url": "https://cdn.datatables.net/plug-ins/1.11.4/i18n/es_es.json"
        }
    });
}

function ShowPhoneCreate() {
    $("#FormModalPhone").modal("hide");
    $("#FormModalPhoneCreate").modal("show");

    $("#PhoneCreate").val("");
    $("#ActivePhoneCreate").val(1);
    $("#ErrorPhoneCreate").hide();
    CreatePhoneForm.resetForm();
}

function ValidatorPhone() {

    CreatePhoneForm = $("#CreatePhoneForm").validate({
        rules: {
            PhoneCreate: {
                required: true,
                phoneNumber: true
            }
        },
        messages: {
            PhoneCreate: {
                required: "Este campo es obligatorio."
            }
        },
        errorClass: "errorTextForm",
        errorElement: "p"
    });

    UpdatePhoneForm = $("#UpdatePhoneForm").validate({
        rules: {
            PhoneUpdate: {
                required: true,
                phoneNumber: true
            }
        },
        messages: {
            PhoneUpdate: {
                required: "Este campo es obligatorio."
            }
        },
        errorClass: "errorTextForm",
        errorElement: "p"
    });
}

function ShowPhoneCreate() {
    $("#FormModalPhone").modal("hide");
    $("#FormModalPhoneCreate").modal("show");

    $("#PhoneCreate").val("");
    $("#ActivePhoneCreate").val(1);
    $("#ErrorPhoneCreate").hide();
    CreatePhoneForm.resetForm();
}

function CreatePhone() {

    if (!$("#CreatePhoneForm").valid()) {
        return;
    }

    phoneObj = {
        "Customer": customerObj,
        "PhoneNumber": $("#PhoneCreate").val(),
        "Active": $("#ActivePhoneCreate option:selected").val() == 1
    }

    jQuery.ajax({
        url: '/Customer/CreateCustomerPhone',
        type: "POST",
        data: JSON.stringify({ customerPhone: phoneObj }),
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function (response) {
            // Ocultar Carga y Modal
            $(".modal-body").LoadingOverlay("hide");
            $("#FormModalPhoneCreate").modal("hide");

            // Si se creo entonces notificar
            if (response.result) {
                successAudio.play();
                swal({
                    title: "¡Buen trabajo!",
                    text: "¡Has creado un nuevo teléfono!",
                    type: "success",
                    confirmButtonClass: "btn-success",
                    confirmButtonText: "Aceptar",
                    closeOnConfirm: true
                },
                    function () {
                        $("#FormModalPhone").modal("show");
                        phoneTable.ajax.reload();
                    });
            }
            // Sino entonces notificar 
            else {
                var text = response.message;
                if (response.message.includes("'UQ__Customer__85FB4E3809963162'")) {
                    text = "El teléfono que intenta agregar ya existe.";
                }
                errorAudio.play();
                swal({
                    title: "¡Algo salió mal!",
                    text: text,
                    type: "error",
                    confirmButtonClass: "btn-danger",
                    confirmButtonText: "Aceptar",
                    closeOnConfirm: true
                },
                    function () {
                        $("#FormModalPhoneCreate").modal("show");
                    });
            }
        },
        error: function (error) {
            $(".modal-body").LoadingOverlay("hide");
            $("#ErrorCreate").text(error.responseText);
            $("#ErrorCreate").show();
        },
        beforeSend: function () {

            $(".modal-body").LoadingOverlay("show", {
                imageResizeFactor: 2,
                text: "Cargando...",
                size: 14
            });
        }
    });
}

function ShowPhoneUpdate() {
    $("#FormModalPhone").modal("hide");
    $("#FormModalPhoneUpdate").modal("show");
    rowSelected = $(this).closest("tr");
    if ($(rowSelected).hasClass('child')) {
        rowSelected = $(rowSelected).prev();
    }

    phoneObj = phoneTable.row(rowSelected).data();

    $("#IdPhoneUpdate").val(phoneObj.Id);
    $("#PhoneUpdate").val(phoneObj.PhoneNumber);
    $("#ActivePhoneUpdate").val(phoneObj.Active ? 1 : 0);
    $("#ErrorPhoneUpdate").hide();
    UpdatePhoneForm.resetForm();
}

function UpdatePhone() {
    if (!$("#UpdatePhoneForm").valid()) {
        return;
    }

    var phoneObj = {
        "Id": $("#IdPhoneUpdate").val(),
        "Customer": customerObj,
        "PhoneNumber": $("#PhoneUpdate").val(),
        "Active": $("#ActivePhoneUpdate option:selected").val() == 1
    }

    console.log(phoneObj);

    jQuery.ajax({
        url: '/Customer/UpdateCustomerPhone',
        type: "POST",
        data: JSON.stringify({ customerPhone: phoneObj }),
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function (response) {
            // Ocultar Carga y Modal
            $(".modal-body").LoadingOverlay("hide");
            $("#FormModalPhoneUpdate").modal("hide");

            // Si se creo entonces notificar
            if (response.result) {
                successAudio.play();
                swal({
                    title: "¡Buen trabajo!",
                    text: "¡Has actualizado el teléfono!",
                    type: "success",
                    confirmButtonClass: "btn-success",
                    confirmButtonText: "Aceptar",
                    closeOnConfirm: true
                },
                    function () {
                        $("#FormModalPhone").modal("show");
                        phoneTable.ajax.reload();
                    });
            }
            // Sino entonces notificar 
            else {
                var text = response.message;
                if (response.message.includes("'UQ__Customer__85FB4E3809963162'")) {
                    text = "El teléfono al que intenta utilizar ya existe.";
                }
                errorAudio.play();
                swal({
                    title: "¡Algo salió mal!",
                    text: text,
                    type: "error",
                    confirmButtonClass: "btn-danger",
                    confirmButtonText: "Aceptar",
                    closeOnConfirm: true
                },
                    function () {
                        $("#FormModalPhoneUpdate").modal("show");
                    });
            }
        },
        error: function (error) {
            $(".modal-body").LoadingOverlay("hide");
            $("#ErrorUpdate").text(error.responseText);
            $("#ErrorUpdate").show();
        },
        beforeSend: function () {

            $(".modal-body").LoadingOverlay("show", {
                imageResizeFactor: 2,
                text: "Cargando...",
                size: 14
            });
        }
    });
}

function DeletePhone() {
    rowSelected = $(this).closest("tr");
    if ($(rowSelected).hasClass('child')) {
        rowSelected = $(rowSelected).prev();
    }
    phoneObj = phoneTable.row(rowSelected).data();

    $("#FormModalPhone").modal("hide");

    if (!phoneObj.Active) {
        warningAudio.play();
        swal({
            title: "Información",
            text: "El teléfono se encuentra deshabilitado, no puede realizar esta acción.",
            type: "info",
            confirmButtonClass: "btn-info",
            confirmButtonText: "Aceptar",
            closeOnConfirm: true
        },
            function () {
                $("#FormModalPhone").modal("show");
            }
        );
        return;
    }

    // Preguntar antes de eliminar
    warningAudio.play();
    swal({
        title: "Eliminar Teléfono",
        text: "¿Estás seguro de que deseas eliminar este teléfono?",
        type: "warning",
        showCancelButton: true,
        confirmButtonClass: "btn-danger",
        confirmButtonText: "¡Sí, bórralo!",
        cancelButtonText: "¡No, cancela por favor!",
        closeOnConfirm: false,
        closeOnCancel: false
    },
        function (isConfirm) {
            // Si el usuario confirma entonces eliminarlo
            if (isConfirm) {
                jQuery.ajax({
                    url: '/Customer/DeleteCustomerPhone',
                    type: "POST",
                    data: JSON.stringify({ customerPhone: phoneObj }),
                    dataType: "json",
                    contentType: "application/json; charset=utf-8",
                    success: function (response) {
                        // Si se eliminó entonces notificar y actualizar tabla
                        if (response.result) {
                            successAudio.play();
                            swal({
                                title: "¡Eliminado!",
                                text: "Su teléfono ha sido eliminado.",
                                type: "success",
                                confirmButtonClass: "btn-success",
                                confirmButtonText: "Aceptar",
                                closeOnConfirm: true
                            },
                                function () {
                                    $("#FormModalPhone").modal("show");
                                    phoneTable.ajax.reload();
                                }
                            );
                        }
                        // Sino Entonces Notificar Error
                        else {
                            var text = response.message;
                            errorAudio.play();
                            swal({
                                title: "¡Algo salió mal!",
                                text: text,
                                type: "error",
                                confirmButtonClass: "btn-danger",
                                confirmButtonText: "Aceptar",
                                closeOnConfirm: true
                            });
                        }
                    },
                    error: function (error) {
                        console.log(error);
                    },
                    beforeSend: function () { }
                });
            }
            // Sino entonces notificar la cancelación
            else {
                swal({
                    title: "Cancelado",
                    text: "Su teléfono está intacto.",
                    type: "info",
                    confirmButtonClass: "btn-info",
                    confirmButtonText: "Aceptar",
                    closeOnConfirm: true
                },
                    function () {
                        $("#FormModalPhone").modal("show");
                    }
                );
            }
        }
    );
}

function ShowEmailRead() {

    $("#FormModalEmail").modal("show");

    rowSelected = $(this).closest("tr");
    if ($(rowSelected).hasClass('child')) {
        rowSelected = $(rowSelected).prev();
    }

    customerObj = customerTable.row(rowSelected).data();

    if (emailTable != null) {
        emailTable.destroy();
    }

    emailTable = $('#dataTableEmail').DataTable({
        responsive: true,
        ordering: true,
        "ajax": {
            url: '/Customer/ReadCustomerEmailsByCustomerId',
            type: "POST",
            data: { customerId: customerObj.Id }
        },
        "columns": [
            { "data": "Id" },
            { "data": "Email" },
            {
                "data": "Active", "render": function (value) {
                    if (value)
                        return '<h4><span class="badge badge-success">Habilitado</span></h4>';
                    else
                        return '<h4><span class="badge badge-danger">Deshabilitado</span></h4>';
                }
            },
            {
                "defaultContent": '<button type="button" class="btn btn-primary btn-circle btn-sm btn-update mr-1 mb-1 data-toggle="tooltip" title="Editar correo""><i class="fas fa-pen"></i></button>' +
                    '<button type="button" class="btn btn-danger btn-circle btn-sm ms-2 btn-detelete mr-1 mb-1 data-toggle="tooltip" title="Eliminar correo""><i class="fas fa-trash"></i></button>',
                "orderable": false,
                "searchable": false
            }
        ],
        "language": {
            "url": "https://cdn.datatables.net/plug-ins/1.11.4/i18n/es_es.json"
        }
    });
}

function ValidatorEmail() {

    CreateEmailForm = $("#CreateEmailForm").validate({
        rules: {
            EmailCreate: {
                required: true,
                email: true
            }
        },
        messages: {
            EmailCreate: {
                required: "Este campo es obligatorio."
            }
        },
        errorClass: "errorTextForm",
        errorElement: "p"
    });

    UpdateEmailForm = $("#UpdateEmailForm").validate({
        rules: {
            EmailUpdate: {
                required: true,
                email: true
            }
        },
        messages: {
            EmailUpdate: {
                required: "Este campo es obligatorio."
            }
        },
        errorClass: "errorTextForm",
        errorElement: "p"
    });
}

function ShowEmailCreate() {
    $("#FormModalEmail").modal("hide");
    $("#FormModalEmailCreate").modal("show");

    $("#EmailCreate").val("");
    $("#ActiveEmailCreate").val(1);
    $("#ErrorEmailCreate").hide();
    CreateEmailForm.resetForm();
}

function CreateEmail() {

    if (!$("#CreateEmailForm").valid()) {
        return;
    }

    emailObj = {
        "Customer": customerObj,
        "Email": $("#EmailCreate").val(),
        "Active": $("#ActiveEmailCreate option:selected").val() == 1
    }

    jQuery.ajax({
        url: '/Customer/CreateCustomerEmail',
        type: "POST",
        data: JSON.stringify({ customerEmail: emailObj }),
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function (response) {
            // Ocultar Carga y Modal
            $(".modal-body").LoadingOverlay("hide");
            $("#FormModalEmailCreate").modal("hide");

            // Si se creo entonces notificar
            if (response.result) {
                successAudio.play();
                swal({
                    title: "¡Buen trabajo!",
                    text: "¡Has creado un nuevo correo!",
                    type: "success",
                    confirmButtonClass: "btn-success",
                    confirmButtonText: "Aceptar",
                    closeOnConfirm: true
                },
                    function () {
                        emailTable.ajax.reload();
                        $("#FormModalEmail").modal("show");
                    });
            }
            // Sino entonces notificar 
            else {
                var text = response.message;
                if (response.message.includes("'UQ__Customer__A9D10534AF4D286F'")) {
                    text = "El correo que intenta agregar ya existe.";
                }
                errorAudio.play();
                swal({
                    title: "¡Algo salió mal!",
                    text: text,
                    type: "error",
                    confirmButtonClass: "btn-danger",
                    confirmButtonText: "Aceptar",
                    closeOnConfirm: true
                },
                    function () {
                        $("#FormModalEmailCreate").modal("show");
                    });
            }
        },
        error: function (error) {
            $(".modal-body").LoadingOverlay("hide");
            $("#ErrorCreate").text(error.responseText);
            $("#ErrorCreate").show();
        },
        beforeSend: function () {

            $(".modal-body").LoadingOverlay("show", {
                imageResizeFactor: 2,
                text: "Cargando...",
                size: 14
            });
        }
    });
}

function ShowEmailUpdate() {
    $("#FormModalEmail").modal("hide");
    $("#FormModalEmailUpdate").modal("show");
    rowSelected = $(this).closest("tr");
    if ($(rowSelected).hasClass('child')) {
        rowSelected = $(rowSelected).prev();
    }

    emailObj = emailTable.row(rowSelected).data();

    $("#IdEmailUpdate").val(emailObj.Id);
    $("#EmailUpdate").val(emailObj.Email);
    $("#ActiveEmailUpdate").val(emailObj.Active ? 1 : 0);
    $("#ErrorEmailUpdate").hide();
    UpdateEmailForm.resetForm();
}

function UpdateEmail() {
    if (!$("#UpdateEmailForm").valid()) {
        return;
    }

    emailObj = {
        "Id": $("#IdEmailUpdate").val(),
        "Customer": customerObj,
        "Email": $("#EmailUpdate").val(),
        "Active": $("#ActiveEmailUpdate option:selected").val() == 1
    }

    jQuery.ajax({
        url: '/Customer/UpdateCustomerEmail',
        type: "POST",
        data: JSON.stringify({ customerEmail: emailObj }),
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function (response) {
            // Ocultar Carga y Modal
            $(".modal-body").LoadingOverlay("hide");
            $("#FormModalEmailUpdate").modal("hide");

            // Si se creo entonces notificar
            if (response.result) {
                successAudio.play();
                swal({
                    title: "¡Buen trabajo!",
                    text: "¡Has actualizado el correo!",
                    type: "success",
                    confirmButtonClass: "btn-success",
                    confirmButtonText: "Aceptar",
                    closeOnConfirm: true
                },
                    function () {
                        emailTable.ajax.reload();
                        $("#FormModalEmail").modal("show");
                    });
            }
            // Sino entonces notificar 
            else {
                var text = response.message;
                if (response.message.includes("'UQ__Customer__A9D10534AF4D286F'")) {
                    text = "El correo que intenta utilizar ya existe.";
                }
                errorAudio.play();
                swal({
                    title: "¡Algo salió mal!",
                    text: text,
                    type: "error",
                    confirmButtonClass: "btn-danger",
                    confirmButtonText: "Aceptar",
                    closeOnConfirm: true
                },
                    function () {
                        $("#FormModalEmailUpdate").modal("show");
                    });
            }
        },
        error: function (error) {
            $(".modal-body").LoadingOverlay("hide");
            $("#ErrorUpdate").text(error.responseText);
            $("#ErrorUpdate").show();
        },
        beforeSend: function () {

            $(".modal-body").LoadingOverlay("show", {
                imageResizeFactor: 2,
                text: "Cargando...",
                size: 14
            });
        }
    });
}

function DeleteEmail() {

    rowSelected = $(this).closest("tr");

    if ($(rowSelected).hasClass('child')) {
        rowSelected = $(rowSelected).prev();
    }

    emailObj = emailTable.row(rowSelected).data();

    $("#FormModalEmail").modal("hide");

    if (!emailObj.Active) {
        warningAudio.play();
        swal({
            title: "Información",
            text: "El correo se encuentra deshabilitado, no puede realizar esta acción.",
            type: "info",
            confirmButtonClass: "btn-info",
            confirmButtonText: "Aceptar",
            closeOnConfirm: true
        },
            function () {
                $("#FormModalEmail").modal("show");
            }
        );
        return;
    }

    // Preguntar antes de eliminar
    warningAudio.play();
    swal({
        title: "Eliminar Correo",
        text: "¿Estás seguro de que deseas eliminar este correo?",
        type: "warning",
        showCancelButton: true,
        confirmButtonClass: "btn-danger",
        confirmButtonText: "¡Sí, bórralo!",
        cancelButtonText: "¡No, cancela por favor!",
        closeOnConfirm: false,
        closeOnCancel: false
    },
        function (isConfirm) {
            // Si el usuario confirma entonces eliminarlo
            if (isConfirm) {
                jQuery.ajax({
                    url: '/Customer/DeleteCustomerEmail',
                    type: "POST",
                    data: JSON.stringify({ customerEmail: emailObj }),
                    dataType: "json",
                    contentType: "application/json; charset=utf-8",
                    success: function (response) {
                        // Si se eliminó entonces notificar y actualizar tabla
                        if (response.result) {
                            successAudio.play();
                            swal({
                                title: "¡Eliminado!",
                                text: "Su correo ha sido eliminado.",
                                type: "success",
                                confirmButtonClass: "btn-success",
                                confirmButtonText: "Aceptar",
                                closeOnConfirm: true
                            },
                                function () {
                                    $("#FormModalEmail").modal("show");
                                    emailTable.ajax.reload();
                                }
                            );
                        }
                        // Sino Entonces Notificar Error
                        else {
                            var text = response.message;
                            errorAudio.play();
                            swal({
                                title: "¡Algo salió mal!",
                                text: text,
                                type: "error",
                                confirmButtonClass: "btn-danger",
                                confirmButtonText: "Aceptar",
                                closeOnConfirm: true
                            },
                                function () {
                                    $("#FormModalEmail").modal("show");
                                }
                            );
                        }
                    },
                    error: function (error) {
                        console.log(error);
                    },
                    beforeSend: function () { }
                });
            }
            // Sino entonces notificar la cancelación
            else {
                swal({
                    title: "Cancelado",
                    text: "Su teléfono está intacto.",
                    type: "info",
                    confirmButtonClass: "btn-info",
                    confirmButtonText: "Aceptar",
                    closeOnConfirm: true
                },
                    function () {
                        $("#FormModalEmail").modal("show");
                    }
                );
            }
        }
    );
}

document.addEventListener('DOMContentLoaded', function () {
    SetUp();
});
