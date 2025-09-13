let
  nixpkgs = fetchTarball "https://github.com/NixOS/nixpkgs/archive/8cd5ce828d5d1d16feff37340171a98fc3bf6526.tar.gz";

  pkgs = import nixpkgs { config = {}; overlays = []; };
in


pkgs.mkShellNoCC {
  packages = with pkgs; [
    # infra
    localstack
    skaffold
    k9s
    kubernetes-helm

    # Tools
    typescript-language-server
    nodePackages.prettier
    gopls

    # Programming Languages
    nodejs_22
    pnpm
    go
  ];
}
