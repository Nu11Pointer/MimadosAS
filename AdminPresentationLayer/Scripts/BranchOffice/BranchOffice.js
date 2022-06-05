var branchOfficeTableRowSelected;
var branchOfficeTable;
var branchOfficeObj;
var phoneObj;
var phoneTable
var CreateForm;
var UpdateForm;
var CreatePhoneForm;
var UpdatePhoneForm;

function SetUp() {

    $('#nav-BranchOffice').addClass('active');
    // Show DataTable
    Read();
    DeparmentReadyCreate();
    ValidatorCreate();
    DeparmentReadyUpdate();
    ValidatorUpdate();
    jQuery.validator.addMethod("phoneNumber", function (value, element) {
        return this.optional(element) || /^[0-9]{4}-[0-9]{4}$/i.test(value);
    }, "El formato correcto es ####-####");
    ValidatorPhoneCreate();
    ValidatorPhoneUpdate();

    $("#dataTable tbody").on("click", '.btn-update', ShowUpdateModal);
    $("#dataTable tbody").on("click", '.btn-detelete', Delete);
    $("#dataTable tbody").on("click", '.btn-phone', ShowPhoneRead);
    $("#dataTablePhone tbody").on("click", '.btn-update', ShowPhoneUpdate);
    $("#dataTablePhone tbody").on("click", '.btn-detelete', DeletePhone);
}

function ShowCreateModal() {
    $("#NameCreate").val("");
    $("#PhoneCreate").val("");
    $("#Active").val(1);
    $("#DepartmentCreate").val($("#DepartmentCreate option:first").val());
    $("#MunicipalityCreate").val($("#MunicipalityCreate option:first").val());
    $("#AddressCreate").val("");
    $("#FormModalCreate").modal("show");
    $("#ErrorCreate").hide();
    CreateForm.resetForm();
}

function DeparmentReadyCreate() {
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
            })
        },
        error: function (error) {
            console.log(error);
        }
    }).done(ChangeMunicipalityCreate);
}

function ChangeMunicipalityCreate() {

    $("#MunicipalityCreate option").remove();

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
}

function ValidatorCreate() {
    CreateForm = $("#CreateForm").validate({
        rules: {
            NameCreate: {
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
            AddressCreate: {
                required: "Este campo es obligatorio."
            }
        },
        errorClass: "errorTextForm",
        errorElement: "p"
    });
}

function ShowUpdateModal() {

    var rowSelected = $(this).closest("tr");
    if ($(rowSelected).hasClass('child')) {
        rowSelected = $(rowSelected).prev();
    }

    branchOfficeObj = branchOfficeTable.row(rowSelected).data();

    $("#NameUpdate").val(branchOfficeObj.Name);
    $("#ActiveUpdate").val(branchOfficeObj.Active ? 1 : 0);
    $("#DepartmentUpdate").val(branchOfficeObj.Municipality.Department.Id);
    $("#DepartmentUpdate").trigger("change");
    $("#AddressUpdate").val(branchOfficeObj.Address);
    $("#FormModalUpdate").modal("show");
    $("#ErrorUpdate").hide();
    UpdateForm.resetForm();
}

function DeparmentReadyUpdate() {
    // Load Selector Department
    jQuery.ajax({
        url: '/Deparment/Read',
        type: "GET",
        data: null,
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function (data) {
            $.each(data.data, function (_index, value) {
                $("<option>").attr({ "value": value.Id }).text(value.Name).appendTo("#DepartmentUpdate");
            })
        },
        error: function (error) {
            console.log(error);
        }
    }).done(ChangeMunicipalityUpdate);
}

function ChangeMunicipalityUpdate() {

    $("#MunicipalityUpdate option").remove();

    // Load Selector Municipality
    jQuery.ajax({
        url: '/Municipality/ReadByDepartment',
        type: "POST",
        data: JSON.stringify({ deparmentId: $("#DepartmentUpdate option:selected").val() }),
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function (data) {
            $.each(data.data, function (_index, value) {
                $("<option>").attr({ "value": value.Id }).text(value.Name).appendTo("#MunicipalityUpdate");
            })
            try {
                if (branchOfficeObj.Municipality.Id != -1) {
                    $("#MunicipalityUpdate").val(branchOfficeObj.Municipality.Id);
                    branchOfficeObj.Municipality.Id = -1;
                }
            } catch (e) {

            }
        },
        error: function (error) {
            console.log(error);
        }
    });
}

function ValidatorUpdate() {
    UpdateForm = $("#UpdateForm").validate({
        rules: {
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
            AddressUpdate: {
                required: "Este campo es obligatorio."
            }
        },
        errorClass: "errorTextForm",
        errorElement: "p"
    });
}

function ShowPhoneRead() {

    var rowSelected = $(this).closest("tr");
    if ($(rowSelected).hasClass('child')) {
        rowSelected = $(rowSelected).prev();
    }

    branchOfficeObj = branchOfficeTable.row(rowSelected).data();

    if (!branchOfficeObj.Active) {
        warningAudio.play();
        swal("Información", "La sucursal se encuentra deshabilitada, no puede realizar esta acción.", "info");
        return;
    }

    $("#FormModalPhone").modal("show");

    if (phoneTable != null) {
        phoneTable.destroy();
    }

    phoneTable = $('#dataTablePhone').DataTable({
        responsive: true,
        ordering: true,
        "ajax": {
            url: '/BranchOffice/ReadBranchOfficePhoneByBranchOfficeId',
            type: "POST",
            data: { branchOfficeId: branchOfficeObj.Id }
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
                "defaultContent": '<button type="button" class="btn btn-primary btn-circle btn-sm btn-update mr-1 mb-1  data-toggle="tooltip" title="Editar teléfono"><i class="fas fa-pen"></i></button>' +
                    '<button type="button" class="btn btn-danger btn-circle btn-sm ms-2 btn-detelete mr-1 mb-1  data-toggle="tooltip" title="Eliminar teléfono"><i class="fas fa-trash"></i></button>',
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

function ValidatorPhoneCreate() {

    CreatePhoneForm = $("#CreatePhoneForm").validate({
        rules: {
            PhoneCreate: {
                required: true,
                phoneNumber: true
            }
        },
        messages: {
            PhoneCreate: {
                required: "Este campo es obligatorio.",
                phoneNumber: "El formato debe ser 0000-0000"
            }
        },
        errorClass: "errorTextForm",
        errorElement: "p"
    });
}

function ShowPhoneUpdate() {
    $("#FormModalPhone").modal("hide");
    $("#FormModalPhoneUpdate").modal("show");
    var rowSelected = $(this).closest("tr");
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

function ValidatorPhoneUpdate() {

    UpdatePhoneForm = $("#UpdatePhoneForm").validate({
        rules: {
            PhoneUpdate: {
                required: true,
                phoneNumber: true
            }
        },
        messages: {
            PhoneUpdate: {
                required: "Este campo es obligatorio.",
                phoneNumber: "El formato debe ser 0000-0000"
            }
        },
        errorClass: "errorTextForm",
        errorElement: "p"
    });
}

function Create() {

    if (!$("#CreateForm").valid()) {
        return;
    }

    branchOfficeObj = {
        Id: 0,
        Name: $("#NameCreate").val(),
        Address: $("#AddressCreate").val(),
        Municipality: {
            Id: $("#MunicipalityCreate option:selected").val()
        },
        Active: $("#ActiveCreate option:selected").val() == 1 ? true : false,
    };

    jQuery.ajax({
        url: '/BranchOffice/CreateBranchOffice',
        type: "POST",
        data: JSON.stringify({ branchOffice: branchOfficeObj }),
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
                    text: "¡Has creado una nueva sucursal!",
                    type: "success",
                    confirmButtonClass: "btn-success",
                    confirmButtonText: "Aceptar",
                    closeOnConfirm: true
                },
                    function () {
                        branchOfficeTable.ajax.reload();
                    });
            }
            // Sino entonces notificar
            else {
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

function Read() {
    branchOfficeTable = $('#dataTable').DataTable({
        responsive: true,
        ordering: true,
        "ajax": {
            url: '/BranchOffice/ReadBranchOffices',
            type: "GET",
            dataType: "json"
        },
        "columns": [
            { "data": "Id" },
            { "data": "Name" },
            { "data": "Municipality.Department.Name" },
            { "data": "Municipality.Name" },
            {
                "data": "Active", "render": function (value) {
                    if (value)
                        return '<h4><span class="badge badge-success">Habilitada</span></h4>';
                    else
                        return '<h4><span class="badge badge-danger">Deshabilitada</span></h4>';
                }
            },
            {
                "defaultContent": '<button type="button" class="btn btn-primary btn-circle btn-sm btn-update mr-1 mb-1" data-toggle="tooltip" title="Editar sucursal"><i class="fas fa-pen"></i></button>' +
                    '<button type="button" class="btn btn-danger btn-circle btn-sm ms-2 btn-detelete mr-1 mb-1 data-toggle="tooltip" title="Eliminar sucursal"><i class="fas fa-trash"></i></button>' +
                    '<button type="button" class="btn btn-success btn-circle btn-sm btn-phone mr-1 mb-1 data-toggle="tooltip" title="Ver teléfonos"><i class="fas fa-phone-alt"></i></button>',
                "orderable": false,
                "searchable": false
            }
        ],
        "language": {
            "url": "https://cdn.datatables.net/plug-ins/1.11.4/i18n/es_es.json"
        }
    });
}

function Update() {

    if (!$("#UpdateForm").valid()) {
        return;
    }

    branchOfficeObj = {
        Id: branchOfficeObj.Id,
        Name: $("#NameUpdate").val(),
        Address: $("#AddressUpdate").val(),
        Municipality: {
            Id: $("#MunicipalityUpdate option:selected").val()
        },
        Active: $("#ActiveUpdate option:selected").val() == 1 ? true : false,
    };

    jQuery.ajax({
        url: '/BranchOffice/UpdateBranchOffice',
        type: "POST",
        data: JSON.stringify({ branchOffice: branchOfficeObj }),
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function (response) {
            // Ocultar Carga y Modal
            $(".modal-body").LoadingOverlay("hide");
            $("#FormModalUpdate").modal("hide");
            // Si se creó entonces notificar
            if (response.result) {
                successAudio.play();
                swal({
                    title: "¡Buen trabajo!",
                    text: "¡Has actualizado la sucursal!",
                    type: "success",
                    confirmButtonClass: "btn-success",
                    confirmButtonText: "Aceptar",
                    closeOnConfirm: true
                },
                    function () {
                        branchOfficeTable.ajax.reload();
                    });
            }
            // Sino entonces notificar
            else {
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
    branchOfficeTableRowSelected = $(this).closest("tr");

    if ($(branchOfficeTableRowSelected).hasClass('child')) {
        branchOfficeTableRowSelected = $(branchOfficeTableRowSelected).prev();
    }

    branchOfficeObj = branchOfficeTable.row(branchOfficeTableRowSelected).data();

    if (!branchOfficeObj.Active) {
        warningAudio.play();
        swal("Información", "La sucursal se encuentra deshabilitada, no puede realizar esta acción.", "info");
        return;
    }

    warningAudio.play();
    // Preguntar antes de eliminar
    swal({
        title: "Eliminar Sucursal",
        text: "¡No podrás recuperar esta sucursal!",
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
                    url: '/BranchOffice/DeleteBranchOffice',
                    type: "POST",
                    data: JSON.stringify({ branchOffice: branchOfficeObj }),
                    dataType: "json",
                    contentType: "application/json; charset=utf-8",
                    success: function (response) {
                        // Si se eliminó entonces notificar y actualizar tabla
                        if (response.result) {
                            successAudio.play();
                            swal({
                                title: "¡Eliminado!",
                                text: "Su sucursal ha sido eliminada.",
                                type: "success",
                                confirmButtonClass: "btn-success",
                                confirmButtonText: "Aceptar",
                                closeOnConfirm: true
                            },
                                function () {
                                    branchOfficeTable.ajax.reload();
                                }
                            );
                        }
                        // Sino Entonces Notificar Error
                        else {
                            var text = response.message;
                            if (response.message.includes("\"FK__BranchOff__Branc__300424B4\"")) {
                                text = "La sucursal que tratas de eliminar está siendo utilizada.";
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
                swal("Cancelado", "Su sucursal está intacta.", "info");
            }
        }
    );
}

function CreatePhone() {
    if (!$("#CreatePhoneForm").valid()) {
        return;
    }

    var branchOfficePhoneObj = {
        "BranchOffice": branchOfficeObj,
        "PhoneNumber": $("#PhoneCreate").val(),
        "Active": $("#ActivePhoneCreate option:selected").val() == 1
    }

    jQuery.ajax({
        url: '/BranchOffice/CreateBranchOfficePhone',
        type: "POST",
        data: JSON.stringify({ branchOfficePhone: branchOfficePhoneObj }),
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
                        phoneTable.ajax.reload();
                        $("#FormModalPhone").modal("show");
                    });
            }
            // Sino entonces notificar 
            else {
                var text = response.message;
                if (response.message.includes("'UQ__BranchOf__85FB4E3844D82730'")) {
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
            errorAudio.play();
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

function UpdatePhone() {
    if (!$("#UpdatePhoneForm").valid()) {
        return;
    }

    var branchOfficePhoneObj = {
        "Id": $("#IdPhoneUpdate").val(),
        "BranchOffice": branchOfficeObj,
        "PhoneNumber": $("#PhoneUpdate").val(),
        "Active": $("#ActivePhoneUpdate option:selected").val() == 1
    }

    console.log("Aqui va", branchOfficePhoneObj);

    jQuery.ajax({
        url: '/BranchOffice/UpdateBranchOfficePhone',
        type: "POST",
        data: JSON.stringify({ branchOfficePhone: branchOfficePhoneObj }),
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function (response) {
            // Ocultar Carga y Modal
            $(".modal-body").LoadingOverlay("hide");
            $("#FormModalPhoneUpdate").modal("hide");
            // Si se creó entonces notificar
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
                        phoneTable.ajax.reload();
                        $("#FormModalPhone").modal("show");
                    });
            }
            // Sino entonces notificar
            else {
                var text = response.message;
                if (response.message.includes("'UQ__BranchOf__85FB4E3844D82730'")) {
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
    var rowSelected = $(this).closest("tr");

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
                    url: '/BranchOffice/DeleteBranchOfficePhone',
                    type: "POST",
                    data: JSON.stringify({ branchOfficePhone: phoneObj }),
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

document.addEventListener('DOMContentLoaded', function () {
    SetUp();
});
