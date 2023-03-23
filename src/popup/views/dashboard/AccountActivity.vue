<script setup lang="ts">
import { Account } from "../../store/account";
import { Icon } from "@iconify/vue";
import { ellipsizeAddress } from "../../../utils/utils";

const props = defineProps<{
  account: Account
}>();

const getIconForTxType = (txType: string): string => {
  switch (txType) {
    case "send":
      return "ph:arrow-bend-double-up-right-fill";
    case "receive":
      return "ph:arrow-bend-down-left-fill";
    default:
      return "mdi:cog-transfer";
  }
};

const getTextForTxType = (txType: string): string => {
  switch (txType) {
    case "send":
      return "Sent";
    case "receive":
      return "Received";
    default:
      return "TX";
  }
};

</script>
<template>
  <div class="activity-container">
    <div class="headline">Activity</div>
    <div class="activities">
      <div v-for="activity in account.activity" class="activity" :key="activity.id">
        <div class="first-line">
          <Icon class="type-icon" :icon="getIconForTxType(activity.type)" />
          <div class="type-text">{{ getTextForTxType(activity.type) }}</div>
          <div class="amount" v-if="activity.amount && activity.type === 'receive' || activity.type === 'send'"
               :class="{[activity.type]: true}">
            {{ activity.type === "receive" ? "+" : "-" }}&nbsp;&nbsp;{{ parseFloat(activity.amount.toFixed(4)) }}
          </div>
        </div>
        <div class="second-line">
          <div class="timestamp">{{ new Date(activity.timestamp).toDateString() }}</div>
          <div class="address" v-if="activity.address">0x{{ ellipsizeAddress(activity.address, 4, 4).toUpperCase() }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.activity-container {
  display: flex;
  justify-content: center;
  flex-direction: column;

  .headline {
    background: transparentize($app-primary, 0.8);
    width: 100%;
    font-size: 14px;
    color: $app-primary-dark;
    font-weight: 600;
    padding: 3px 0;
  }
}

.activities {
  overflow-y: auto;
  height: 140px;
}

.activity {
  display: flex;
  flex-direction: column;
  padding: 13px 22px;
  border-bottom: 1.5px solid $app-primary;


  .first-line, .second-line {
    display: flex;
    flex-direction: row;
    align-items: center;
    flex: 1;
  }

  .first-line {
    .type-icon {
      font-size: 27px;
      color: $app-secondary;
    }

    .type-text {
      margin-left: 11px;
      font-size: 16px;
      font-weight: 600;
    }

    .amount {
      margin-left: auto;
      font-size: 16px;
      font-weight: bold;
      color: #d72323;
    }

    .amount.receive {
      color: #26c767;
    }
  }

  .second-line {
    margin-top: 6px;
    .timestamp, .address {
      font-size: 13px;
      font-weight: 600;
      color: #c1c1c1;
    }

    .address {
      margin-left: auto;
    }
  }
}
</style>
