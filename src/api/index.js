// src/api/index.js
import { request } from "./http";

// ---------- auth / профиль ----------
export async function apiGetMe() {
  const data = await request("/me"); // data = { user: {...} }
  console.log("apiGetMe data:", data);
  return data;                       // <-- ВАЖНО: возвращаем весь объект, не user
}

// ---------- боты ----------
export async function apiGetMyBots() {
  const data = await request("/bots");
  console.log("apiGetMyBots data:", data);
  return data;
}

export function apiGetBot(id) {
  return request(`/bots/${id}`);
}

export function apiCreateBot(payload) {
  return request("/bots/create", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function apiUpdateBot(id, payload) {
  return request(`/bots/${id}/update`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function apiDeleteBot(id) {
  return request(`/bots/${id}/delete`, { method: "POST" });
}

export function apiBlockBot(id) {
  return request(`/bots/${id}/block`, { method: "POST" });
}

export function apiUnblockBot(id) {
  return request(`/bots/${id}/unblock`, { method: "POST" });
}

// ---------- группы ----------
export function apiAddGroup(botId, { chatId, title }) {
  return request(`/bots/${botId}/groups/add`, {
    method: "POST",
    body: JSON.stringify({ chatId, title }),
  });
}

export function apiDeleteGroup(botId, chatId) {
  return request(`/bots/${botId}/groups/delete`, {
    method: "POST",
    body: JSON.stringify({ chatId }),
  });
}

// ---------- рефералка ----------
export function apiGetReferralInfo() {
  return request("/referral");
}

// ---------- dev helper ----------
export function apiGrantAccessDev() {
  return request("/dev/grant-access", { method: "POST" });
}
