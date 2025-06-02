<script setup>
import { SquarePen, ExternalLink } from "lucide-vue-next";
const route = useRoute();

const applicationId = route.params.id;
const applicationData = ref(null);

const userDetails = computed(() => applicationData.value?.expand?.user || {});

const applicationDetails = computed(() => {
  const {
    expand,
    collectionId,
    collectionName,
    created,
    updated,
    status,
    status_details,
    user,
    ...rest
  } = applicationData.value || {};
  Object.keys(rest).forEach((key) => {
    const value = rest[key];
    if (
      typeof value === "string" &&
      (value.endsWith(".png") || value.endsWith(".jpg") ||
        value.endsWith(".jpeg") || value.endsWith(".gif") ||
        value.endsWith(".webp") || value.endsWith(".bmp") ||
        value.endsWith(".svg") || value.endsWith(".pdf"))) {
      delete rest[key];
    }
  });
  return rest;
});

const applicationDocuments = computed(() => {
  const docs = {};
  if (!applicationData.value) return docs;
  Object.keys(applicationData.value).forEach((key) => {
    const value = applicationData.value[key];
    if (
      typeof value === "string" &&
      (value.endsWith(".png") || value.endsWith(".jpg") ||
        value.endsWith(".jpeg") || value.endsWith(".gif") ||
        value.endsWith(".webp") || value.endsWith(".bmp") ||
        value.endsWith(".svg") || value.endsWith(".pdf"))
    ) {
      docs[key] = value;
    }
  });
  return docs;
});

const getDocumentStatus = (docKey) => {
  const details = applicationData.value?.status_details || [];
  const found = details.find((item) => item.document === docKey);
  return found ? found.status : "N/A";
};

const getDocumentComment = (docKey) => {
  const details = applicationData.value?.status_details || [];
  const found = details.find((item) => item.document === docKey);
  return found ? found.comment : "N/A";
};

const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  try {
    return new Date(dateString).toLocaleString("en-MY");
  } catch (e) {
    return "Invalid Date";
  }
};

onMounted(async () => {
  try {
    // update status to "in review" when fetching 
    const currentRecord = await useNuxtApp()
      .$pb.collection('qualification').getOne(applicationId);
    if (currentRecord.status === "submitted") {
      await useNuxtApp()
        .$pb.collection('qualification').update(applicationId, { "status": "in review" });
    }

    // Fetch application data with user expansion
    const record = await useNuxtApp()
      .$pb.collection("qualification")
      .getOne(applicationId, {
        expand: "user",
      });
    applicationData.value = record;
  } catch (error) {
    console.error("Error fetching application data:", error);
  }
});

const documentStatus = ref({});
const documentComment = ref({});

watch(applicationDocuments, (docs) => {
  Object.keys(docs).forEach((key) => {
    if (!(key in documentStatus.value)) {
      documentStatus.value[key] = getDocumentStatus(key);
    }
    if (!(key in documentComment.value)) {
      documentComment.value[key] = getDocumentComment(key);
    }
  });
});

const handleUpdate = async () => {
  try {
    // Create updated status_details array using reactive data
    const updatedStatusDetails = Object.keys(applicationDocuments.value).map(
      (key) => ({
        document: key,
        status: documentStatus.value[key],
        comment: documentComment.value[key],
      })
    );

    // Prepare data for update
    const data = {
      // Keep original user relationship
      user: applicationData.value.user,

      // Map application details (only for fields that should be updated)
      ...applicationDetails.value,

      status: Object.keys(documentStatus.value).some(
        (key) => documentStatus.value[key] === "need update"
      )
        ? "need update"
        : "approved",


      // Update status_details with new values
      status_details: updatedStatusDetails,
    };

    // Send update to PocketBase
    const record = await useNuxtApp()
      .$pb.collection("qualification")
      .update(applicationId, data);

    // Show success message
    reloadNuxtApp();
  } catch (error) {
    console.error("Error updating application:", error);
    alert("Failed to update application: " + error.message);
  }
};
</script>

<template>
  <div class="flex gap-4">
    <div class="w-1/3 flex flex-col gap-2">
      <div class="bg-primary-foreground p-4 rounded flex flex-col gap-2">
        <h1 class="text-lg font-bold">Application</h1>
        <div class="grid grid-cols-[120px_1fr] gap-2">
          <span class="font-semibold">Type:</span>
          <span>{{ applicationData?.collectionName || "Not visible" }}</span>

          <span class="font-semibold">ID:</span>
          <span>{{ applicationData?.id || "N/A" }}</span>

          <span class="font-semibold">Created:</span>
          <span>{{
            applicationData?.created
              ? formatDate(applicationData.created)
              : "N/A"
          }}</span>

          <span class="font-semibold">Updated:</span>
          <span>{{
            applicationData?.updated
              ? formatDate(applicationData.updated)
              : "N/A"
          }}</span>

          <span class="font-semibold">Status:</span>
          <span>{{ applicationData?.status || "N/A" }}</span>
        </div>
      </div>

      <div class="bg-primary-foreground p-4 rounded flex flex-col gap-2">
        <h1 class="text-lg font-bold">User</h1>
        <div class="grid grid-cols-[120px_1fr] gap-2">
          <span class="font-semibold">Name:</span>
          <span>{{ userDetails?.name || "N/A" }}</span>

          <span class="font-semibold">Email:</span>
          <span>{{ userDetails?.email || "Not visible" }}</span>

          <span class="font-semibold">ID:</span>
          <span>{{ userDetails?.id || "N/A" }}</span>
        </div>
      </div>
    </div>

    <div class="w-full">
      <div class="bg-primary-foreground p-4 rounded w">
        <h1 class="text-lg font-bold">Data</h1>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Label</TableHead>
              <TableHead>Value</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow v-for="([key, value], index) in Object.entries(
              applicationDetails
            ) || []" :key="key">
              <TableCell> {{ key }} </TableCell>
              <TableCell>
                <Input v-model="applicationDetails[key]" />
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
      <div class="bg-primary-foreground p-4 rounded mt-4">
        <h1 class="text-lg font-bold">Documents</h1>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Label</TableHead>
              <TableHead>Value</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Comment</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow v-for="(doc, index) in applicationDocuments || []" :key="index">
              <TableCell>{{ index }}</TableCell>
              <TableCell>{{ doc }}</TableCell>
              <TableCell>
                <Select v-model="documentStatus[index]">
                  <SelectTrigger>
                    <SelectValue :placeholder="getDocumentStatus(index)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="need update">Need Update</SelectItem>
                    <SelectItem value="approve">Approve</SelectItem>
                  </SelectContent>
                </Select>
              </TableCell>
              <TableCell>
                <Input v-model="documentComment[index]" :disabled="documentStatus[index] === 'approve'" :placeholder="documentStatus[index] === 'approve'
                  ? 'No comment needed'
                  : 'Enter comment'
                  " @update:modelValue="
                    (val) => {
                      if (documentStatus[index] === 'approve') {
                        documentComment[index] = '';
                      }
                    }
                  " />
              </TableCell>
              <TableCell>
                <NuxtLink :to="`${useRuntimeConfig().public.pocketbaseUrl}/api/files/${applicationData.collectionId
                  }/${applicationData.id}/${doc}`" target="_blank">
                  <ExternalLink class="h-4 w-4 cursor-pointer" />
                </NuxtLink>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>

      <Button class="mt-4" @click="handleUpdate">Submit</Button>
    </div>
  </div>
</template>
