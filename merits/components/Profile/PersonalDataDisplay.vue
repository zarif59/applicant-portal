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

const dataDisplayDocument = ref([
  {
    label: "Photo",
    value: personalData.data.photo,
  },
  {
    label: "NRIC Photocopy",
    value: personalData.data.nric_photocopy,
  },
]);

const dataStatus = ref(personalData.data.status);
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
          <Badge
            v-if="index === 0"
            :class="{
              'bg-green-400': dataStatus === 'approved',
              'bg-blue-400': dataStatus === 'submitted',
              'bg-orange-400': dataStatus === 'in review',
            }"
          >
            {{ dataStatus }}
          </Badge>
        </div>
      </div>
      <Separator class="my-4" />
      <div
        v-for="(doc, index) in dataDisplayDocument"
        :key="index"
        class="mb-4"
      >
        <div class="flex">
          <span class="font-semibold min-w-[180px]">{{ doc.label }}:</span>
          <NuxtLink
            :to="`${
              useRuntimeConfig().public.pocketbaseUrl
            }/api/files/personal_data/${personalData.data.id}/${doc.value}`"
            target="_blank"
          >
            {{ doc.value }}
            <ExternalLink class="inline w-4 h-4 ml-2" />
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>
