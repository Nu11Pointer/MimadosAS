var branchOfficePhoneTable;
var branchOfficePhoneObj;
var rowSelected;

function SetUp() {

    $('#CollapseMenuBranchOffice').addClass('active');
    $('#collapseOne').addClass('show');
    $('#CollapseMenuItemBranchOfficePhone').addClass('active');

    // Show DataTable
    Read();
    BranchOfficeReady();
    ValidatorPhone()
    $("#dataTable tbody").on("click", '.btn-update', ShowUpdateModal);
    $("#dataTable tbody").on("click", '.btn-detelete', Delete);
}

function ShowCreateModal() {
    $("#BranchOfficeCreateSelect").val($("#BranchOfficeCreateSelect option:first").val());
    $("#PhoneNumberCreate").val("");
    $("#ActivePhoneCreate").val(1);
    $("#CreateBranchOfficePhoneModal").modal("show");
    $("#ErrorCreate").hide();
}

function BranchOfficeReady() {
    // Load BranchOffice Selector 
    jQuery.ajax({
        url: '/BranchOffice/ReadBranchOffices',
        type: "GET",
        data: null,
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function (data) {
            $.each(data.data, function (_index, value) {
                $("<option>").attr({ "value": value.Id }).text(value.Name).appendTo("#BranchOfficeCreateSelect");
                $("<option>").attr({ "value": value.Id }).text(value.Name).appendTo("#BranchOfficeUpdateSelect");
            })
        },
        error: function (error) {
            console.log(error);
        }
    });
}

function ValidatorPhone() {

    jQuery.validator.addMethod("phoneNumber", function (value, element) {
        return this.optional(element) || /^[0-9]{4}-[0-9]{4}$/i.test(value);
    }, "El formato correcto es ####-####");

    $("#CreateBranchOfficePhoneForm").validate({
        rules: {
            PhoneNumberCreate: {
                required: true,
                phoneNumber: true
            }
        },
        messages: {
            PhoneNumberCreate: { required: "- El campo \"Teléfono\" es obligatorio." }
        },
        errorElement: "div",
        errorClass: "form-label",
        errorLabelContainer: ".alert-danger"
    });

    $("#UpdateBranchOfficePhoneForm").validate({
        rules: {
            PhoneNumberUpdate: {
                required: true,
                phoneNumber: true
            }
        },
        messages: {
            PhoneNumberUpdate: { required: "- El campo \"Teléfono\" es obligatorio." }
        },
        errorElement: "div",
        errorClass: "form-label",
        errorLabelContainer: ".alert-danger"
    });
}

function ShowUpdateModal() {

    rowSelected = $(this).closest("tr");
    if ($(rowSelected).hasClass('child')) {
        rowSelected = $(rowSelected).prev();
    }

    branchOfficePhoneObj = branchOfficePhoneTable.row(rowSelected).data();

    $("#BranchOfficeUpdateSelect").val(branchOfficePhoneObj.BranchOffice.Id);
    $("#PhoneNumberUpdate").val(branchOfficePhoneObj.PhoneNumber);
    $("#ActivePhoneUpdate").val(branchOfficePhoneObj.Active ? 1 : 0);
    $("#UpdateBranchOfficePhoneModal").modal("show");
    $("#ErrorUpdate").hide();
}

function Create() {

    if (!$("#CreateBranchOfficePhoneForm").valid()) {
        return;
    }

    branchOfficePhoneObj = {
        PhoneNumber: $("#PhoneNumberCreate").val(),
        BranchOffice: {
            Id: $("#BranchOfficeCreateSelect option:selected").val()
        },
        Active: $("#ActiveCreate option:selected").val() == 1 ? true : false,
    };

    jQuery.ajax({
        url: '/BranchOffice/CreateBranchOfficePhone',
        type: "POST",
        data: JSON.stringify({ branchOfficePhone: branchOfficePhoneObj }),
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function (response) {
            if (response.result) {
                $(".modal-body").LoadingOverlay("hide");
                $("#CreateBranchOfficePhoneModal").modal("hide");
                branchOfficePhoneTable.ajax.reload();
            }
            else {
                swal("No Logró Crear el teléfono.", response.message, "error");
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
    branchOfficePhoneTable = $('#dataTable').DataTable({
        responsive: true,
        ordering: true,
        "ajax": {
            url: '/BranchOffice/ReadBranchOfficePhones',
            type: "GET",
            dataType: "json"
        },
        "columns": [
            { "data": "Id" },
            { "data": "PhoneNumber" },
            { "data": "BranchOffice.Name" },
            {
                "data": "Active", "render": function (value) {
                    if (value)
                        return '<h4><span class="badge badge-success">Habilitado</span></h4>';
                    else
                        return '<h4><span class="badge badge-danger">Deshabilitado</span></h4>';
                }
            },
            {
                "defaultContent": '<button type="button" class="btn btn-primary btn-circle btn-sm btn-update mr-1 mb-1"><i class="fas fa-pen"></i></button>' +
                    '<button type="button" class="btn btn-danger btn-circle btn-sm ms-2 btn-detelete mr-1 mb-1"><i class="fas fa-trash"></i></button>',
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

    if (!$("#CreateBranchOfficePhoneForm").valid()) {
        return;
    }

    console.log(branchOfficePhoneObj);

    branchOfficePhoneObj = {
        Id: branchOfficePhoneObj.Id,
        PhoneNumber: $("#PhoneNumberUpdate").val(),
        BranchOffice: {
            Id: $("#BranchOfficeUpdateSelect option:selected").val()
        },
        Active: $("#ActivePhoneUpdate option:selected").val() == 1,
    };

    console.log(branchOfficePhoneObj);

    jQuery.ajax({
        url: '/BranchOffice/UpdateBranchOfficePhone',
        type: "POST",
        data: JSON.stringify({ branchOfficePhone: branchOfficePhoneObj }),
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function (response) {

            if (response.result) {
                $(".modal-body").LoadingOverlay("hide");
                $("#UpdateBranchOfficePhoneModal").modal("hide");
                branchOfficePhoneTable.ajax.reload();
            }
            else {
                swal("No Logró Actualizar el teléfono.", response.message, "error");
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
    branchOfficePhoneObj = branchOfficePhoneTable.row(rowSelected).data();
    swal({
        title: "Eliminar Sucursal",
        text: "¿Estas Seguro que Deseas Eliminar Este Teléfono?",
        type: "warning",
        showCancelButton: true,
        confirmButtonClass: "btn-primary",
        confirmButtonText: "Si",
        cancelButtonText: "No",
        closeOnConfirm: true
    },
        function () {

            jQuery.ajax({
                url: '/BranchOffice/DeleteBranchOfficePhone',
                type: "POST",
                data: JSON.stringify({ branchOfficePhone: branchOfficePhoneObj }),
                dataType: "json",
                contentType: "application/json; charset=utf-8",
                success: function (response) {

                    if (response.result) {
                        branchOfficePhoneTable.ajax.reload();
                    }
                    else {
                        swal("No Se Logró Eliminar El teléfono.", response.message, "error");
                    }
                },
                error: function (error) {
                    console.log(error);
                },
                beforeSend: function () { }
            });
        });
}

document.addEventListener('DOMContentLoaded', function () {
    SetUp();
});
