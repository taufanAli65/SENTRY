<template>
  <form @submit.prevent="onLogin">
    <Input v-model="email" placeholder="Email" type="email" required />
    <Input v-model="password" placeholder="Password" type="password" required />
    <Button type="submit">Login</Button>
    <div v-if="error" style="color:red">{{ error }}</div>
  </form>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/stores/user';
import { login } from '../api/auth';
import Button from '@/components/ui/button/Button.vue';
import { Input } from '@/components/ui/input';

const email = ref('');
const password = ref('');
const error = ref('');
const router = useRouter();
const userStore = useUserStore();

async function onLogin() {
  error.value = '';
  try {
    const res = await login(email.value, password.value);
    userStore.setUser(res.data.data);
    // Redirect sesuai role
    if (res.data.data.role === 'owner') router.push('/owner');
    else if (res.data.data.role === 'admin') router.push('/admin');
    else router.push('/employee');
  } catch (e: any) {
    error.value = e.response?.data?.message || 'Login failed';
  }
}
</script>
