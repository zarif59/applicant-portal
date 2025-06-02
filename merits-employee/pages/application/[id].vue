<script setup>
import { SquarePen } from "lucide-vue-next";
const route = useRoute();

const applicationId = route.params.id;
const applicationData = ref(null);

const userDetails = computed(() => applicationData.value?.expand?.user || {});
const applicationDetails = computed(() => {
  const { expand, collectionId, collectionName, ...rest } =
    applicationData.value || {};
  return rest;
});

const formatDate = (dateString) => {
  if (!dateString) return "";
  return new Date(dateString).toLocaleDateString("en-MY");
};

onMounted(async () => {
  try {
    const record = await useNuxtApp()
      .$pb.collection("personal_data")
      .getOne(applicationId, {
        expand: "user",
      });
    applicationData.value = record;
  } catch (error) {
    console.error("Error fetching application data:", error);
  }
});
</script>

<template>
  <div v-if="userDetails" class="flex gap-4">
    <div class="w-1/3 flex flex-col gap-2">
      <div class="bg-primary-foreground p-4 rounded flex flex-col gap-2">
        <h1 class="text-lg font-bold">User Information</h1>
        <div class="grid grid-cols-[120px_1fr] gap-2">
          <span class="font-semibold">Name:</span>
          <span>{{ userDetails?.name || "N/A" }}</span>

          <span class="font-semibold">Email:</span>
          <span>{{ userDetails?.email || "Not visible" }}</span>

          <span class="font-semibold">User ID:</span>
          <span>{{ userDetails?.id || "N/A" }}</span>

          <span class="font-semibold">Created:</span>
          <span>{{ formatDate(userDetails?.created) }}</span>
        </div>
      </div>

      <div class="bg-primary-foreground p-4 rounded">
        <h1 class="text-lg font-bold mb-2">Personal Data</h1>
        <div class="grid grid-cols-[120px_1fr] gap-2">
          <span class="font-semibold">Full Name:</span>
          <span>{{ "N/A" }}</span>
        </div>
        <p class="text-sm text-muted-foreground">
          No qualification data available yet
        </p>
      </div>

      <div class="bg-primary-foreground p-4 rounded">
        <h1 class="text-lg font-bold">Qualification</h1>
        <p class="text-sm text-muted-foreground">
          No qualification data available yet
        </p>
      </div>
    </div>

    <div class="bg-primary-foreground p-4 rounded w-full">
      <h1 class="text-lg font-bold">Documents</h1>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Document</TableHead>
            <TableHead>Content</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow
            v-for="(doc, index) in applicationDetails || []"
            :key="index"
          >
            <TableCell> {{ index }} </TableCell>
            <TableCell> {{ doc }} </TableCell>
            <TableCell> </TableCell>
            <TableCell>
              <SquarePen class="h-4 w-4 cursor-pointer" />
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  </div>

  <div v-else class="flex items-center justify-center h-40">
    <p>Loading application data...</p>
  </div>
</template>
