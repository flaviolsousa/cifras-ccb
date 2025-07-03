import AES from "crypto-js/aes";
import SHA256 from "crypto-js/sha256";
import Utf8 from "crypto-js/enc-utf8";

class CryptoService {
  private static generateKey(): string {
    const extraKey = process.env.ENC_KEY_EXTRA || "default-extra-key";
    const combined = process.env.BASE_KEY + extraKey;
    return SHA256(combined).toString(); // AES espera string de 256 bits
  }

  static decrypt(encryptedData: string): any {
    try {
      const key = this.generateKey();
      const decrypted = AES.decrypt(encryptedData, key).toString(Utf8);
      return JSON.parse(decrypted);
    } catch (error) {
      console.error("Decryption error:", error);
      return null;
    }
  }
}

export default CryptoService;
