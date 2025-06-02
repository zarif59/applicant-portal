<script setup>
import { ExternalLink } from "lucide-vue-next";

const dataTable = ref([]);

onMounted(async () => {
  const recordsPersonalData = await useNuxtApp()
    .$pb.collection("personal_data")
    .getFullList({
      sort: "-created",
    });

  const recordsQualification = await useNuxtApp()
    .$pb.collection("qualification")
    .getFullList({
      sort: "-created",
    });

  // Process personal data records
  const personalDataRows = recordsPersonalData.map((record) => ({
    id: record.id,
    userId: record.user,
    requestType: "personal_data",
    created: new Date(record.created).toLocaleString("en-MY"),
    updated: new Date(record.updated).toLocaleString("en-MY"),
    status: record.status,
  }));

  // Process qualification records
  const qualificationRows = recordsQualification.map((record) => ({
    id: record.id,
    userId: record.user,
    requestType: "qualification",
    created: new Date(record.created).toLocaleString("en-MY"),
    updated: new Date(record.updated).toLocaleString("en-MY"),
    status: record.status,
  }));

  // Combine both types of records
  dataTable.value = [...personalDataRows, ...qualificationRows].sort(
    (a, b) => new Date(b.created) - new Date(a.created)
  );
});
</script>

<template>
  <div>
    <div class="mb-8 border p-4 rounded-lg">
      <h1 class="text-xl font-bold mb-4">Task - In progress</h1>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead> Application ID </TableHead>
            <TableHead>Application type</TableHead>
            <TableHead>User ID</TableHead>
            <TableHead> Created </TableHead>
            <TableHead> Updated </TableHead>
            <TableHead> Status </TableHead>
            <TableHead> Action </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow
            v-for="record in dataTable.filter(
              (r) => r.status === 'in review' || r.status === 'need update'
            )"
            :key="record.id"
          >
            <TableCell class="font-medium">{{ record.id }}</TableCell>
            <TableCell>{{ record.requestType }}</TableCell>
            <TableCell>{{ record.userId }}</TableCell>
            <TableCell>{{ record.created }}</TableCell>
            <TableCell>{{ record.updated }}</TableCell>
            <TableCell>{{ record.status }}</TableCell>
            <TableCell>
              <NuxtLink :to="`/${record.requestType}/${record.id}`"
                ><ExternalLink class="h-4 w-4"
              /></NuxtLink>
            </TableCell>
          </TableRow>
          <TableRow
            v-if="
              dataTable.filter((r) => r.status === 'in_review').length === 0
            "
          >
            <TableCell colspan="6" class="text-center">No records</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>

    <div class="mb-8 border p-4 rounded-lg">
      <h1 class="text-xl font-bold mb-4">Task - New</h1>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead> Application ID </TableHead>
            <TableHead>Application type</TableHead>
            <TableHead>User ID</TableHead>
            <TableHead> Created </TableHead>
            <TableHead> Updated </TableHead>
            <TableHead> Status </TableHead>
            <TableHead> Action </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow
            v-for="record in dataTable.filter((r) => r.status === 'submitted')"
            :key="record.id"
          >
            <TableCell class="font-medium">{{ record.id }}</TableCell>
            <TableCell>{{ record.requestType }}</TableCell>
            <TableCell>{{ record.userId }}</TableCell>
            <TableCell>{{ record.created }}</TableCell>
            <TableCell>{{ record.updated }}</TableCell>
            <TableCell>{{ record.status }}</TableCell>
            <TableCell>
              <NuxtLink :to="`/${record.requestType}/${record.id}`"
                ><ExternalLink class="h-4 w-4"
              /></NuxtLink>
            </TableCell>
          </TableRow>
          <TableRow
            v-if="
              dataTable.filter((r) => r.status === 'submitted').length === 0
            "
          >
            <TableCell colspan="6" class="text-center">No records</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>

    <div class="mb-8 border p-4 rounded-lg">
      <h1 class="text-xl font-bold mb-4">Task - Done</h1>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Application ID </TableHead>
            <TableHead>Application type</TableHead>
            <TableHead>User ID</TableHead>
            <TableHead> Created </TableHead>
            <TableHead> Updated </TableHead>
            <TableHead> Status </TableHead>
            <TableHead> Action </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow
            v-for="record in dataTable.filter((r) => r.status === 'approved')"
            :key="record.id"
          >
            <TableCell class="font-medium">{{ record.id }}</TableCell>
            <TableCell>{{ record.requestType }}</TableCell>
            <TableCell>{{ record.userId }}</TableCell>
            <TableCell>{{ record.created }}</TableCell>
            <TableCell>{{ record.updated }}</TableCell>
            <TableCell>{{ record.status }}</TableCell>
            <TableCell>
              <NuxtLink :to="`/${record.requestType}/${record.id}`"
                ><ExternalLink class="h-4 w-4"
              /></NuxtLink>
            </TableCell>
          </TableRow>
          <TableRow
            v-if="dataTable.filter((r) => r.status === 'approved').length === 0"
          >
            <TableCell colspan="6" class="text-center">No records</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  </div>
</template>
