<script setup>
const data = ref({
  user: useNuxtApp().$pb.authStore?.record?.id,
  identity_card: "",
  full_name: "",
  gender: "",
  birth_date: "",
  address: "",
  religion: "",
  race: "",
});

const handleSumbit = async () => {
  try {
    const formData = new FormData();
    // Dynamically append all text fields from data
    Object.entries(data.value).forEach(([key, value]) => {
      formData.append(key, value);
    });

    // Append file fields
    const photoInput = document.getElementById("photo");
    if (photoInput && photoInput.files.length > 0) {
      formData.append("photo", photoInput.files[0]);
    }
    const nricInput = document.getElementById("nric_photocopy");
    if (nricInput && nricInput.files.length > 0) {
      formData.append("nric_photocopy", nricInput.files[0]);
    }

    // Set status and status_details
    formData.append("status", "submitted");
    formData.append(
      "status_details",
      JSON.stringify([
        { document: "nric_photocopy", status: "submitted" },
        { document: "photo", status: "submitted" },
      ])
    );

    const record = await useNuxtApp()
      .$pb.collection("personal_data")
      .create(formData);
    console.log("Record created:", record);
    // Success handling - you could add a success message or redirect

    setTimeout(() => {
      reloadNuxtApp();
    }, 3000);
  } catch (error) {
    console.error("Error submitting form:", error);
    // Error handling - display error message to user
  }
};
</script>

<template>
  <div>
    <form @submit.prevent="handleSumbit">
      <div class="flex gap-4 mb-4">
        <Label class="w-[180px]">Full Name</Label>
        <Input
          v-model="data.full_name"
          type="text"
          class="uppercase"
          required
        />
      </div>

      <div class="flex gap-4 mb-4">
        <Label class="w-[180px]">Identity Card</Label>
        <Input
          v-model="data.identity_card"
          type="text"
          required
          class="uppercase"
        />
      </div>

      <div class="flex gap-4 mb-4">
        <Label class="w-[150px]">Gender</Label>
        <Select v-model="data.gender" required>
          <SelectTrigger>
            <SelectValue class="w-[130px]" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="male"> Male </SelectItem>
              <SelectItem value="female"> Female </SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      <div class="flex gap-4 mb-4">
        <Label class="w-[150px]">Birth Date</Label>
        <Input
          v-model="data.birth_date"
          type="date"
          required
          class="uppercase w-[180px]"
        />
      </div>

      <div class="flex gap-4 mb-4">
        <Label class="w-[180px]">Address</Label>
        <Input v-model="data.address" type="text" required class="uppercase" />
      </div>

      <div class="flex gap-4 mb-4">
        <Label class="w-[180px]">Religion</Label>
        <Input v-model="data.religion" type="text" required class="uppercase" />
      </div>

      <div class="flex gap-4 mb-4">
        <Label class="w-[180px]">Race</Label>
        <Input v-model="data.race" type="text" required class="uppercase" />
      </div>

      <div class="flex gap-4 mb-4">
        <Label class="w-[180px]">Photo</Label>
        <Input id="photo" type="file" accept="image/*" />
      </div>

      <div class="flex gap-4 mb-4">
        <Label class="w-[180px]">NRIC Photocopy</Label>
        <Input id="nric_photocopy" type="file" accept="application/pdf" />
      </div>

      <Button type="submit" class="mt-4">Submit</Button>
    </form>
  </div>
</template>
