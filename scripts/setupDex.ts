// @ts-nocheck
import hardhat from "hardhat";

const deploy = require("./deploy");
const addLiquidity = require("./interactions/add-liquidity");
const addLiquidityHbar = require("./interactions/add-liquidity-hbar");
const approve = require("./utilities/erc20-approve");

async function setupDex() {
  const WHBARAddress = "0x0000000000000000000000000000000000CFc209";

  const USDCAddress = "0x000000000000000000000000000000000006a5c5";
  const WETHAddress = "0x000000000000000000000000000000000006a5e2";
  const WBTCAddress = "0x000000000000000000000000000000000006a5F0";
  const HELIAddress = "0x000000000000000000000000000000000001d7FA";

  const feeToSetter = "0x00000000000000000000000000000000000191Ff";

  // Deploy factory and router
  console.log("⚙️ Deploying factory and router...");
  const { router, factory } = await deploy(WHBARAddress, feeToSetter);
  console.log("✅ Factory address", factory.address);
  console.log("✅ Router address", router.address);

  const routerAddress = router.address;
  const factoryAddress = factory.address;

  // Approve tokens
  console.log("⚙️ Approving tokens...");
  await approve(USDCAddress, router.address, 1000000_000_000);
  await approve(WETHAddress, router.address, 1000000_000_000_00);
  await approve(WBTCAddress, router.address, 1000000_000_000_00);
  await approve(HELIAddress, router.address, 1000000_000_000_00);
  console.log("✅ Tokens approved");

  // Create HBAR/USD pool
  console.log("⚙️ Creating HBAR/USD pool...");
  await addLiquidityHbar(routerAddress, USDCAddress, "5400000", "100");
  console.log("✅ HBAR/USD pool created");

  // Create HBAR/HELI pool
  console.log("⚙️ Creating HBAR/HELI pool...");
  await addLiquidityHbar(routerAddress, HELIAddress, "42300000000", "100");
  console.log("✅ HBAR/HELI pool created");

  // Create USD/WETH pool
  console.log("⚙️ Creating USD/WETH pool...");
  await addLiquidity(
    routerAddress,
    USDCAddress,
    "18700000000",
    WETHAddress,
    "1000000000"
  );
  console.log("✅ USD/WETH pool created");
}

module.exports = setupDex;
