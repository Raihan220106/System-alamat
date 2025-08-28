$(document).ready(function () {
  const API_BASE = "http://localhost:4003/api";

  // Load data awal
  loadProvinsi();
  loadAlamat();

  // Load provinsi ke dropdown
  function loadProvinsi() {
    $.ajax({
      url: `${API_BASE}/provinsi`,
      method: "GET",
      success: function (data) {
        console.log("Provinsi data received:", data);
        const provinsiSelect = $("#provinsi");
        provinsiSelect.empty();
        provinsiSelect.append('<option value="">Pilih Provinsi</option>');

        data.forEach(function (provinsi) {
          provinsiSelect.append(
            `<option value="${provinsi.id}">${provinsi.nama}</option>`
          );
        });

        // Setelah provinsi ter-load, coba isi ulang form dari localStorage
        loadFormFromLocalStorage();
      },
      error: function (xhr, status, error) {
        console.error("Error loading provinsi:", error);
        console.error("Response:", xhr.responseText);
        alert("Gagal memuat data provinsi");
      },
    });
  }

  // Load kota berdasarkan provinsi yang dipilih
  $("#provinsi").change(function () {
    const provinsiId = $(this).val();
    const kotaSelect = $("#kota");
    console.log("Provinsi ID selected:", provinsiId);

    if (provinsiId) {
      $.ajax({
        url: `${API_BASE}/kota/${provinsiId}`,
        method: "GET",
        success: function (data) {
          console.log("Kota data received:", data);
          kotaSelect.empty();
          kotaSelect.append('<option value="">Pilih Kota</option>');

          if (data && data.length > 0) {
            data.forEach(function (kota) {
              kotaSelect.append(
                `<option value="${kota.id}">${kota.nama}</option>`
              );
            });
          } else {
            kotaSelect.append('<option value="">Tidak ada kota</option>');
          }

          // Jika ada data kota tersimpan di localStorage, set value
          const savedData = localStorage.getItem("alamatForm");
          if (savedData) {
            const formData = JSON.parse(savedData);
            if (formData.kota_id) {
              kotaSelect.val(formData.kota_id);
            }
          }
        },
        error: function (xhr, status, error) {
          console.error("Error loading kota:", error);
          console.error("Response:", xhr.responseText);
          alert("Gagal memuat data kota");
        },
      });
    } else {
      kotaSelect.empty();
      kotaSelect.append('<option value="">Pilih Provinsi Terlebih Dahulu</option>');
    }
  });

  // Load semua alamat
  function loadAlamat() {
    $.ajax({
      url: `${API_BASE}/alamat`,
      method: "GET",
      success: function (data) {
        console.log("Alamat data received:", data);
        const tbody = $("#alamat-data");
        tbody.empty();

        if (data.length === 0) {
          tbody.append(
            '<tr><td colspan="7" style="text-align: center;">Tidak ada data</td></tr>'
          );
          return;
        }

        data.forEach(function (alamat, index) {
          tbody.append(`
            <tr>
              <td>${index + 1}</td>
              <td>${alamat.nama}</td>
              <td>${alamat.email}</td>
              <td>${alamat.provinsi_nama || "-"}</td>
              <td>${alamat.kota_nama || "-"}</td>
              <td>${alamat.alamat_lengkap}</td>
              <td>
                <button class="action-btn edit-btn" onclick="editAlamat(${alamat.id})">Edit</button>
                <button class="action-btn delete-btn" onclick="deleteAlamat(${alamat.id})">Hapus</button>
              </td>
            </tr>
          `);
        });
      },
      error: function (xhr, status, error) {
        console.error("Error loading alamat:", error);
        console.error("Response:", xhr.responseText);
        alert("Gagal memuat data alamat");
      },
    });
  }

  // Submit form
  $("#alamat-form").submit(function (e) {
    e.preventDefault();

    const formData = {
      nama: $("#nama").val(),
      email: $("#email").val(),
      provinsi_id: $("#provinsi").val(),
      kota_id: $("#kota").val(),
      alamat_lengkap: $("#alamat_lengkap").val(),
    };

    const alamatId = $("#alamat-id").val();
    const method = alamatId ? "PUT" : "POST";
    const url = alamatId ? `${API_BASE}/alamat/${alamatId}` : `${API_BASE}/alamat`;

    // Validasi
    if (!formData.nama || !formData.email || !formData.provinsi_id || !formData.kota_id || !formData.alamat_lengkap) {
      alert("Semua field harus diisi!");
      return;
    }

    $.ajax({
      url: url,
      method: method,
      contentType: "application/json",
      data: JSON.stringify(formData),
      success: function (response) {
        alert(response.message || "Data berhasil disimpan");
        resetForm();
        loadAlamat();
      },
      error: function (xhr, status, error) {
        console.error("Error saving alamat:", error);
        console.error("Response:", xhr.responseText);
        alert("Gagal menyimpan data: " + (xhr.responseJSON?.error || "Unknown error"));
      },
    });
  });

  // Cancel button
  $("#cancel-btn").click(function () {
    resetForm();
  });

  // Edit alamat
  window.editAlamat = function (id) {
    $.ajax({
      url: `${API_BASE}/alamat`,
      method: "GET",
      success: function (data) {
        const alamat = data.find((item) => item.id == id);
        if (alamat) {
          $("#alamat-id").val(alamat.id);
          $("#nama").val(alamat.nama);
          $("#email").val(alamat.email);
          $("#provinsi").val(alamat.provinsi_id).trigger("change");
          $("#alamat_lengkap").val(alamat.alamat_lengkap);

          // Set kota setelah provinsi ter-load
          const interval = setInterval(() => {
            if ($("#kota option").length > 1) {
              $("#kota").val(alamat.kota_id);
              clearInterval(interval);
            }
          }, 100);

          $("#form-title").text("Edit Alamat");
          $("html, body").animate({ scrollTop: $("#alamat-form").offset().top - 100 }, 500);
        }
      },
      error: function (xhr, status, error) {
        console.error("Error loading alamat for edit:", error);
        console.error("Response:", xhr.responseText);
        alert("Gagal memuat data untuk diedit");
      },
    });
  };

  // Delete alamat
  window.deleteAlamat = function (id) {
    if (confirm("Apakah Anda yakin ingin menghapus alamat ini?")) {
      $.ajax({
        url: `${API_BASE}/alamat/${id}`,
        method: "DELETE",
        success: function (response) {
          alert(response.message || "Data berhasil dihapus");
          loadAlamat();
        },
        error: function (xhr, status, error) {
          console.error("Error deleting alamat:", error);
          console.error("Response:", xhr.responseText);
          alert("Gagal menghapus data: " + (xhr.responseJSON?.error || "Unknown error"));
        },
      });
    }
  };

  // Reset form dan hapus localStorage
  function resetForm() {
    $("#alamat-form")[0].reset();
    $("#alamat-id").val("");
    $("#form-title").text("Tambah Alamat Baru");
    $("#kota").empty().append('<option value="">Pilih Provinsi Terlebih Dahulu</option>');
    localStorage.removeItem("alamatForm");
  }

  // === Simpan form ke localStorage saat user mengetik atau memilih ===
  function saveFormToLocalStorage() {
    const formData = {
      nama: $("#nama").val(),
      email: $("#email").val(),
      provinsi_id: $("#provinsi").val(),
      kota_id: $("#kota").val(),
      alamat_lengkap: $("#alamat_lengkap").val(),
    };
    localStorage.setItem("alamatForm", JSON.stringify(formData));
  }

  $("#alamat-form input, #alamat-form select, #alamat-form textarea").on("input change", saveFormToLocalStorage);

  // === Load form dari localStorage saat halaman dimuat ===
  function loadFormFromLocalStorage() {
    const savedData = localStorage.getItem("alamatForm");
    if (!savedData) return;

    const formData = JSON.parse(savedData);
    $("#nama").val(formData.nama || "");
    $("#email").val(formData.email || "");
    $("#alamat_lengkap").val(formData.alamat_lengkap || "");

    if (formData.provinsi_id) {
      $("#provinsi").val(formData.provinsi_id).trigger("change");

      // Tunggu sampai kota ter-load lalu set value kota
      const interval = setInterval(() => {
        if ($("#kota option").length > 1) {
          $("#kota").val(formData.kota_id || "");
          clearInterval(interval);
        }
      }, 100);
    }
  }
});
