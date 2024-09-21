import { getConnection, getRecentConnectionMeta, setRecentConnectionMeta } from "@/connection";
class FailedToConnect extends Error { }

export function useAuth() {
  async function autoConnect() {
    const connection = getConnection();
    const recentConnectionMeta = getRecentConnectionMeta();
    if (!recentConnectionMeta) {
      return false;
    }
    try {
      const { connector } = connection;
      if (connector.connectEagerly) {
        await connector.connectEagerly();
      } else {
        await connector.activate();
      }
      return true;
    } catch (error) {
      console.debug(`web3-react eager connection error: ${error}`);
      return false;
    }
  }

  async function connect() {
    if (window.ethereum == null) {
      console.log('请先安装metamask')
      return { error: "METAMASK_NOT_INSTALLED" }
    }
    const connection = getConnection();
    try {
      const { connector, type } = connection;
      await connector.activate();
      setRecentConnectionMeta({
        type,
        disconnected: false,
      });

      return null;
    } catch (e: unknown) {
      console.log("e", e);
      return e;
    }
  }
  async function disconnect() {
    const connection = getConnection();
    const { connector } = connection;
    connector.resetState();
    connector.deactivate?.();
    setRecentConnectionMeta(undefined);
  }
  return { autoConnect, connect, disconnect };
}

async function connect() {
  const connection = getConnection();
  console.log(connection)
  const { connector } = connection;

  // We intentionally omit setting a non-ok status on this trace, as it is expected to fail.
  try {
    if (connector.connectEagerly) {
      await connector.connectEagerly();
    } else {
      await connector.activate();
    }
    return true;
  } catch (error) {
    console.debug(`web3-react eager connection error: ${error}`);
    return false;
  }
}

// Get the persisted wallet type from the last session.
const recentConnectionMeta = getRecentConnectionMeta();
if (recentConnectionMeta?.type && !recentConnectionMeta.disconnected) {
  const selectedConnection = getConnection();

  // All EIP6963 wallets share one Connection object, `eip6963Connection`
  // To activate the same EIP6963 wallet as the last session, we need to `select` the rdns of the recent connection
  // console.log("selectedConnection", selectedConnection);
  if (selectedConnection) {
    connect()
      .then((connected) => {
        if (!connected) throw new FailedToConnect();
      })
      .catch((error) => {
        // Clear the persisted wallet type if it failed to connect.
        // Log it if it threw an unknown error.
        if (!(error instanceof FailedToConnect)) {
          console.error(error);
        }
      });
  }
}
