document.addEventListener("DOMContentLoaded", function () {
  loadProvinsi();
  loadAlamat();
});

function loadProvinsi() {
  $.ajax({
    url: "http://localhost:3003/api/provinsi",
    method: "GET",
    success: function (data) {
      let provinsiSelect = $("#provinsi");
      provinsiSelect.empty();
      provinsiSelect.append('<option value="">-- Pilih Provinsi --</option>');
      data.forEach(function (prov) {
        provinsiSelect.append(
          `<option value="${prov.id}">${prov.nama}</option>`
        );
      });
    },
    error: function (xhr, status, error) {
      console.error("Error loading provinsi:", error);
      console.error("Response:", xhr.responseText);
    },
  });
}

function loadKota(provinsiId) {
  $.ajax({
    url: "http://localhost:3002/api/kota/" + provinsiId,
    method: "GET",
    success: function (data) {
      let kotaSelect = $("#kota");
      kotaSelect.empty();
      kotaSelect.append('<option value="">-- Pilih Kota --</option>');
      data.forEach(function (kota) {
        kotaSelect.append(`<option value="${kota.id}">${kota.nama}</option>`);
      });
    },
    error: function (xhr, status, error) {
      console.error("Error loading kota:", error);
      console.error("Response:", xhr.responseText);
    },
  });
}

function loadAlamat() {
  $.ajax({
    url: "http://localhost:3002/api/alamat",
    method: "GET",
    success: function (data) {
      let alamatList = $("#alamatList");
      alamatList.empty();
      data.forEach(function (a) {
        alamatList.append(
          `<li>${a.jalan}, ${a.kota}, ${a.provinsi}</li>`
        );
      });
    },
    error: function (xhr, status, error) {
      console.error("Error loading alamat:", error);
      console.error("Response:", xhr.responseText);
    },
  });
}

// Event ketika pilih provinsi
$(document).on("change", "#provinsi", function () {
  let provinsiId = $(this).val();
  if (provinsiId) {
    loadKota(provinsiId);
  } else {
    $("#kota").empty().append('<option value="">-- Pilih Kota --</option>');
  }
});
