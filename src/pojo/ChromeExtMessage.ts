export interface ChromeExtMessage {
  id: string;
  type?: "keep_alive" | "store_password";
  data: unknown;
}
