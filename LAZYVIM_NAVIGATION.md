# LazyVim Navigation pentru Wiki-Links

## Problema
Când ești în `bartolomeu.md` și cursor-ul e pe `[[personalitati/matei-evanghelistul|Sfântul Apostol și Evanghelist Matei]]`, vrei să poți naviga la fișierul `matei-evanghelistul.md`.

## Soluții

### Opțiunea 1: Obsidian.nvim (Recomandat)

Instalează pluginul `obsidian.nvim` care oferă suport complet pentru wiki-links în stil Obsidian.

**Adaugă în LazyVim config (`~/.config/nvim/lua/plugins/obsidian.lua`):**

```lua
return {
  "epwalsh/obsidian.nvim",
  version = "*",
  lazy = true,
  ft = "markdown",
  dependencies = {
    "nvim-lua/plenary.nvim",
  },
  opts = {
    workspaces = {
      {
        name = "apologetica",
        path = "C:/Users/User/OneDrive/01-Proiecte-Main/2026-02-11_apologetica/src/content",
      },
    },
    follow_url_func = function(url)
      vim.fn.jobstart({"cmd.exe", "/c", "start", url})
    end,
    -- Disable wiki link concealing
    ui = {
      enable = false,
    },
  },
  keys = {
    { "gf", "<cmd>ObsidianFollowLink<cr>", desc = "Follow wiki-link", ft = "markdown" },
  },
}
```

**Cum funcționează:**
- Când ești pe un wiki-link și apeși `gf`, obsidian.nvim va deschide fișierul
- Funcționează cu `[[personalitati/slug]]` și `[[personalitati/slug|display text]]`
- Auto-completare pentru link-uri
- Suport pentru navigare înapoi cu `<C-o>`

### Opțiunea 2: Custom Vim Config (Fără Plugin)

Dacă nu vrei plugin, adaugă în config:

**Fișier: `~/.config/nvim/lua/config/autocmds.lua`**

```lua
-- Wiki-link navigation with gf
vim.api.nvim_create_autocmd("FileType", {
  pattern = "markdown",
  callback = function()
    -- Set includeexpr to extract path from wiki-links
    vim.opt_local.includeexpr = [[substitute(v:fname, '\[\[\(.*\)\(|.*\)\?\]\]', '\1', '')]]
    -- Set suffixesadd to add .md extension
    vim.opt_local.suffixesadd = ".md"
    -- Set path to search in src/content
    vim.opt_local.path:prepend("src/content/**")
  end,
})
```

**Cum funcționează:**
- `includeexpr` extrage path-ul din `[[personalitati/slug|text]]` → `personalitati/slug`
- `suffixesadd` adaugă `.md` automat
- `path` caută în `src/content/**`

### Opțiunea 3: Mapare Simplă (Quick & Dirty)

Adaugă în `~/.config/nvim/lua/config/keymaps.lua`:

```lua
-- Extract wiki-link path and open file
vim.keymap.set("n", "gf", function()
  local line = vim.api.nvim_get_current_line()
  local col = vim.api.nvim_win_get_cursor(0)[2]

  -- Find wiki-link pattern around cursor
  local before = line:sub(1, col + 1)
  local after = line:sub(col + 1)

  local start_pos = before:reverse():find("%]%]")
  local end_pos = after:find("%[%[")

  if start_pos and end_pos then
    local wiki_link = before:sub(-(start_pos - 1)) .. after:sub(1, end_pos - 1)
    local path = wiki_link:match("%[%[(.-)%]%]") or wiki_link:match("%[%[(.-)%|")

    if path then
      local full_path = "src/content/" .. path .. ".md"
      vim.cmd("edit " .. full_path)
    end
  else
    -- Fallback to default gf
    vim.cmd("normal! gf")
  end
end, { desc = "Follow wiki-link or file", buffer = true })
```

## Recomandare

**Folosește Opțiunea 1 (Obsidian.nvim)** - este cel mai complet și well-maintained. Oferă și alte features utile:
- Navigare înapoi cu `<C-o>`
- Auto-completare wiki-links
- Rename refactoring
- Daily notes support

## Instalare Rapidă

```bash
# În terminal, din directorul proiectului
cd ~/.config/nvim/lua/plugins
# Creează fișierul obsidian.lua cu conținutul de mai sus
```

Apoi restartează Neovim și pluginul va fi instalat automat de Lazy.nvim.

## Test

1. Deschide `src/content/personalitati/bartolomeu.md`
2. Mută cursorul pe `[[personalitati/matei-evanghelistul|...]]`
3. Apasă `gf`
4. Ar trebui să se deschidă `matei-evanghelistul.md`
5. Apasă `<C-o>` pentru a te întoarce
