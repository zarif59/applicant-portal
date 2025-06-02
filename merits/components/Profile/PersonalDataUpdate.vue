<script setup>
import { ExternalLink } from "lucide-vue-next";

const personalData = defineProps({
  data: {
    type: Object,
    required: true,
  },
});

const dataDisplay = ref([
  {
    label: "Identity Card",
    value: personalData.data.identity_card?.toUpperCase(),
  },
  { label: "Full Name", value: personalData.data.full_name?.toUpperCase() },
  { label: "Gender", value: personalData.data.gender?.toUpperCase() },
  { label: "Birth Date", value: personalData.data.birth_date },
  { label: "Address", value: personalData.data.address?.toUpperCase() },
  { label: "Religion", value: personalData.data.religion?.toUpperCase() },
  { label: "Race", value: personalData.data.race?.toUpperCase() },
]);

const dataStatus = ref(personalData.data.status);

const statusDetailsStatus = (statusDetails, docName) => {
  if (!statusDetails || !Array.isArray(statusDetails)) return "";
  const detail = statusDetails.find((item) => item.document === docName);
  return detail ? detail.status : "";
};

const statusDetailsComment = (statusDetails, docName) => {
  if (!statusDetails || !Array.isArray(statusDetails)) return "";
  const detail = statusDetails.find((item) => item.document === docName);
  return detail ? detail.comment : "";
};

const dataDisplayDocument = ref([
  {
    label: "Photo",
    value: personalData.data.photo,
    status: statusDetailsStatus(personalData.data.status_details, "photo"),
    comment: statusDetailsComment(personalData.data.status_details, "photo"),
  },
  {
    label: "NRIC Photocopy",
    value: personalData.data.nric_photocopy,
    status: statusDetailsStatus(
      personalData.data.status_details,
      "nric_photocopy"
    ),
    comment: statusDetailsComment(
      personalData.data.status_details,
      "nric_photocopy"
    ),
  },
]);

const handleUpdate = async () => {
  try {
    const formData = new FormData();

    // Start with the existing status_details to preserve comments
    const existingStatusDetails = Array.isArray(personalData.data.status_details)
      ? [...personalData.data.status_details]
      : [];

    // Create a map for easier lookup
    const statusDetailsMap = {};
    existingStatusDetails.forEach(detail => {
      statusDetailsMap[detail.document] = detail.comment;
    });

    const updatedStatusDetails = [];

    // Append file fields and update status_details array
    const photoInput = document.getElementById("photo");
    if (photoInput && photoInput.files.length > 0) {
      formData.append("photo", photoInput.files[0]);
      updatedStatusDetails.push({
        document: "photo",
        status: "submitted",
        comment: statusDetailsMap["photo"] || "", // Preserve existing comment
      });
    } else {
      // Include the existing photo status if not being updated
      const existingPhoto = existingStatusDetails.find(d => d.document === "photo");
      if (existingPhoto) {
        updatedStatusDetails.push(existingPhoto);
      }
    }

    const nricInput = document.getElementById("nric_photocopy");
    if (nricInput && nricInput.files.length > 0) {
      formData.append("nric_photocopy", nricInput.files[0]);
      updatedStatusDetails.push({
        document: "nric_photocopy",
        status: "submitted",
        comment: statusDetailsMap["nric_photocopy"] || "", // Preserve existing comment
      });
    } else {
      // Include the existing NRIC status if not being updated
      const existingNric = existingStatusDetails.find(d => d.document === "nric_photocopy");
      if (existingNric) {
        updatedStatusDetails.push(existingNric);
      }
    }

    // Set status general
    formData.append("status", "submitted");

    // Add the complete status_details array as JSON
    if (updatedStatusDetails.length > 0) {
      formData.append("status_details", JSON.stringify(updatedStatusDetails));
    }

    await useNuxtApp()
      .$pb.collection("personal_data")
      .update(personalData.data.id, formData);

    alert("Data updated successfully!");

    setTimeout(() => {
      reloadNuxtApp();
    }, 3000);
  } catch (error) {
    console.error("Failed to update data:", error);
    alert("Failed to update data: " + error.message);
  }
};
</script>

<template>
  <div>
    <div class="bg-primary-foreground rounded">
      <div v-for="(item, index) in dataDisplay" :key="index" class="mb-4">
        <div class="flex justify-between items-center">
          <div class="flex">
            <span class="font-semibold min-w-[180px]">{{ item.label }}:</span>
            <span class="bg-muted px-2 rounded">{{ item.value }}</span>
          </div>
          <Badge v-if="index === 0" :class="{
            'bg-orange-400': dataStatus === 'in review',
            'bg-yellow-400': dataStatus === 'need update',
          }">
            {{ dataStatus }}
          </Badge>
        </div>
      </div>
      <Separator class="my-4" />

      <form @submit.prevent="handleUpdate">
        <div v-for="(item, index) in dataDisplayDocument" :key="index"
          class="flex items-start gap-4 mb-4 border p-2 rounded">
          <Label class="min-w-[160px]">{{ item.label }}</Label>
          <div v-if="item.status === 'need update'" class="flex gap-2">
            <div>
              <Input :id="item.label.toLowerCase().includes('nric') ? 'nric_photocopy' : 'photo'" type="file"
                :accept="item.label.toLowerCase().includes('nric') ? 'application/pdf' : 'image/*'" required />
              <span class="text-yellow-500 text-sm">
                Comment: {{ item.comment }}</span>
            </div>
          </div>
          <div v-else>
            <NuxtLink :to="`${useRuntimeConfig().public.pocketbaseUrl
              }/api/files/personal_data/${personalData.data.id}/${item.value}`" target="_blank">
              {{ item.value }}
              <ExternalLink class="inline w-4 h-4 ml-2" />
            </NuxtLink>
          </div>
        </div>
        <Button v-if="dataStatus === 'need update'" type="submit">
          Update
        </Button>
      </form>

    </div>
  </div>

</template>
