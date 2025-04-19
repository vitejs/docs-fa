---
layout: page
title: آشنایی با تیم
description: توسعه Vite تحت هدایت تیمی بین‌المللی انجام می‌شود.
---

<script setup>
import {
  VPTeamPage,
  VPTeamPageTitle,
  VPTeamPageSection,
  VPTeamMembers
} from 'vitepress/theme'
import { core, emeriti } from './_data/team'
</script>

<VPTeamPage>
  <VPTeamPageTitle>
    <template #title>آشنایی با تیم</template>
    <template #lead>
      توسعه Vite تحت هدایت تیمی بین‌المللی انجام می‌شود
      که برخی از اعضای آن در ادامه معرفی شوند.
    </template>
  </VPTeamPageTitle>
  <VPTeamMembers :members="core" />
  <VPTeamPageSection>
    <template #title>اعضای پیشین تیم</template>
    <template #lead>
        در این بخش از برخی اعضای تیم که دیگر فعال نیستند
        اما در گذشته مشارکت‌های ارزشمندی داشته‌اند، قدردانی می‌شود.
    </template>
    <template #members>
      <VPTeamMembers size="small" :members="emeriti" />
    </template>
  </VPTeamPageSection>
</VPTeamPage>
