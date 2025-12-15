const API = "https://dummyjson.com/users";

// get
const users = document.getElementById("users");
function getUsers() {
    fetch(API)
        .then(res => res.json())
        .then(data => {
            users.innerHTML = "";
            data.users.forEach(p => {
                users.innerHTML += `
                    <tr class="border-b border-b-[#EFEFEF] hover:bg-[#F4F4F4]">
                        <td class="px-4 py-3">
                            <p class="font-semibold">
                                ${p.firstName} ${p.lastName} ${p.maidenName}
                            </p>
                            <p class="text-gray-500 text-sm">${p.phone}</p>
                        </td>

                        <td class="px-4 py-3">
                            <span class="px-3 py-1 bg-[#EFEFEF] rounded-lg text-sm font-semibold">
                                ${p.birthDate}
                            </span>
                        </td>

                        <td class="px-4 py-3">
                            ${p.address?.address || "-"}
                        </td>

                        <td class="px-4 py-3 text-right">
                            <div class="flex justify-end gap-2">
                                <img class="cursor-pointer" src="./assets/calendaredit.svg" />
                                
                                <img
                                  onclick="editUser(
                                    ${p.id},
                                    '${p.firstName}',
                                    '${p.lastName}',
                                    '${p.maidenName}',
                                    '${p.phone}',
                                    '${p.birthDate}',
                                    '${p.address?.address || ""}'
                                  )"
                                  class="cursor-pointer"
                                  src="./assets/Edit (1).svg"
                                />

                                <img
                                  onclick="deleteUser(${p.id})"
                                  class="cursor-pointer"
                                  src="./assets/delete.svg"
                                />
                            </div>
                        </td>
                    </tr>
                `;
            });
        });
}
getUsers();

// delete
function deleteUser(id) {
    fetch(`${API}/${id}`, {
        method: "DELETE"
    })
        .then(res => res.json())
        .then(() => {
            alert("Yдалено ");
            getUsers();
        });
}

// edit create
const form = document.getElementById("createForm");
const editUserId = document.getElementById("editUserId");
form.addEventListener("submit", function (e) {
    e.preventDefault();

    const formData = new FormData(form);

    const userData = {
        firstName: formData.get("firstName"),
        lastName: formData.get("lastName"),
        maidenName: formData.get("maidenName"),
        phone: formData.get("phone"),
        birthDate: formData.get("birthDate"),
        address: {
            address: formData.get("address")
        }
    };


    if (editUserId.value) {
        fetch(`${API}/${editUserId.value}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(userData),
        })
            .then(res => res.json())
            .then(() => {
                alert("Пациент обновлён ");
                resetForm();
                getUsers();
            });

    }
    else {
        fetch(`${API}/add`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(userData),
        })
            .then(res => res.json())
            .then(() => {
                alert("Пациент добавлен");
                resetForm();
                getUsers();
            });
    }
});
function editUser(id, firstName, lastName, maidenName, phone, birthDate, address) {
    editUserId.value = id;

    form.firstName.value = firstName;
    form.lastName.value = lastName;
    form.maidenName.value = maidenName;
    form.phone.value = phone;
    form.birthDate.value = birthDate
    ? new Date(birthDate).toISOString().split("T")[0]
    : "";
    form.address.value = address || "";

    document.getElementById("create")
        .scrollIntoView({ behavior: "smooth" });

    document.querySelector("#create h1").innerText = "Редактировать пациента";
}

function resetForm() {
    form.reset();
    editUserId.value = "";
    document.querySelector("#create h1").innerText = "Добавить пациента";
}