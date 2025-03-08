let
  nixpkgs = fetchTarball "https://github.com/NixOS/nixpkgs/archive/e6cfe7821dc7ebf4e68014de11508d7aeb566fdc.tar.gz";

  pkgs = import nixpkgs { config = {}; overlays = []; };
in


pkgs.mkShellNoCC {
  packages = with pkgs; [
    # infra
    localstack
    skaffold
    k3s
    k3d
    k9s

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
